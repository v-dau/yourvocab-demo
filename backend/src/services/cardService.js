import * as cardRepository from '../repositories/cardRepository.js';

export const createCard = async (cardData) => {
  if (!cardData.word || !cardData.meaning || !cardData.user_id) {
    throw new Error('Word, meaning, and user_id are required fields');
  }

  // Basic validation for levels
  if (cardData.level && !['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(cardData.level)) {
    throw new Error('Invalid level provided. Allowed values: A1, A2, B1, B2, C1, C2');
  }

  // Basic validation for popularity
  if (cardData.popularity && (cardData.popularity < 1 || cardData.popularity > 5)) {
    throw new Error('Invalid popularity provided. Allowed values: 1-5');
  }

  return await cardRepository.createCard(cardData);
};

export const getCards = async (user_id) => {
  if (!user_id) throw new Error('User ID is required');
  return await cardRepository.getCardsByUserId(user_id);
};

export const getCardById = async (id, user_id) => {
  if (!id || !user_id) throw new Error('ID and User ID are required');
  const card = await cardRepository.getCardByIdAndUserId(id, user_id);
  if (!card) {
    throw new Error('Card not found');
  }
  return card;
};

export const updateCard = async (id, user_id, updateData) => {
  if (!id || !user_id) throw new Error('ID and User ID are required');

  if (updateData.level && !['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(updateData.level)) {
    throw new Error('Invalid level provided. Allowed values: A1, A2, B1, B2, C1, C2');
  }
  if (updateData.popularity && (updateData.popularity < 1 || updateData.popularity > 5)) {
    throw new Error('Invalid popularity provided. Allowed values: 1-5');
  }

  const updatedCard = await cardRepository.updateCard(id, user_id, updateData);
  if (!updatedCard) {
    throw new Error('Card not found or unauthorized');
  }

  return updatedCard;
};

export const deleteCard = async (id, user_id) => {
  if (!id || !user_id) throw new Error('ID and User ID are required');

  const isDeleted = await cardRepository.deleteCard(id, user_id);
  if (!isDeleted) {
    throw new Error('Card not found or unauthorized');
  }

  return isDeleted;
};
