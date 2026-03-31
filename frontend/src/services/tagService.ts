import api from '../lib/axios';

export interface Tag {
  id: string;
  tagName: string;
  createdAt?: string;
  cardCount?: number;
}

export const getUserTags = async (): Promise<Tag[]> => {
  const response = await api.get('/tags');
  return response.data.data;
};

export const updateTag = async (id: string, tagName: string): Promise<Tag> => {
  const response = await api.put(`/tags/${id}`, { tagName });
  return response.data.data;
};

export const deleteTag = async (id: string): Promise<void> => {
  await api.delete(`/tags/${id}`);
};
