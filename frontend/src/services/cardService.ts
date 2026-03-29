/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/lib/axios';
import type { Card, CreateCardInput } from '@/types/card';

// Helper function to map snake_case to camelCase
const mapToFrontendCard = (data: any): Card => ({
  id: data.id,
  word: data.word,
  partOfSpeech: data.part_of_speech,
  meaning: data.meaning,
  definition: data.definition,
  ipa: data.ipa,
  example: data.example,
  level: data.level,
  popularity: data.popularity,
  synonyms: data.synonyms,
  antonyms: data.antonyms,
  nearSynonyms: data.near_synonyms,
  userId: data.user_id,
  createdAt: data.created_at,
  modifiedAt: data.modified_at,
  deletedAt: data.deleted_at,
});

// Helper function to map camelCase to snake_case
const mapToBackendCardInput = (data: CreateCardInput | Partial<CreateCardInput>): any => {
  const result: any = { ...data };

  if (data.partOfSpeech !== undefined) {
    result.part_of_speech = data.partOfSpeech;
    delete result.partOfSpeech;
  }
  if (data.nearSynonyms !== undefined) {
    result.near_synonyms = data.nearSynonyms;
    delete result.nearSynonyms;
  }

  return result;
};

export interface PaginationResponse {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

export interface GetCardsResponse {
  data: Card[];
  pagination: PaginationResponse;
}

export const getCards = async (params?: any): Promise<GetCardsResponse> => {
  const response = await api.get('/cards', { params });
  return {
    data: response.data.data.map(mapToFrontendCard),
    pagination: response.data.pagination,
  };
};

export const getCardById = async (id: string): Promise<Card> => {
  const response = await api.get(`/cards/${id}`);
  return mapToFrontendCard(response.data.data);
};

export const createCard = async (data: CreateCardInput): Promise<Card> => {
  const backendData = mapToBackendCardInput(data);
  const response = await api.post('/cards', backendData);
  return mapToFrontendCard(response.data.data);
};

export const updateCard = async (id: string, data: Partial<CreateCardInput>): Promise<Card> => {
  const backendData = mapToBackendCardInput(data);
  const response = await api.put(`/cards/${id}`, backendData);
  return mapToFrontendCard(response.data.data);
};

export const deleteCard = async (id: string): Promise<void> => {
  await api.delete(`/cards/${id}`);
};

export const getTrashCards = async (): Promise<Card[]> => {
  const response = await api.get('/cards/trash');
  return response.data.data.map(mapToFrontendCard);
};

export const restoreCard = async (id: string): Promise<void> => {
  await api.post(`/cards/${id}/restore`);
};

export const hardDeleteCard = async (id: string): Promise<void> => {
  await api.delete(`/cards/${id}/hard`);
};

export const restoreAllCards = async (): Promise<void> => {
  await api.post('/cards/trash/restore-all');
};

export const emptyTrash = async (): Promise<void> => {
  await api.delete('/cards/trash/empty');
};
