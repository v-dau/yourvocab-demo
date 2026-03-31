import * as cardRepository from '../repositories/cardRepository.js';
import tagRepository from '../repositories/tagRepository.js';
import cardTagRepository from '../repositories/cardTagRepository.js';
import { pool } from '../config/db.js';

const isUUID = (uuid) => {
  const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i;
  return regex.test(uuid);
};

export const createCard = async (cardData) => {
  if (!cardData.word || !cardData.meaning || !cardData.user_id) {
    throw new Error('Word, meaning, and user_id are required fields');
  }

  // Basic validation for levels
  if (cardData.level && !['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(cardData.level)) {
    throw new Error('Invalid level provided. Allowed values: A1, A2, B1, B2, C1, C2');
  }

  // Basic validation for popularity
  if (cardData.popularity && (cardData.popularity < 0 || cardData.popularity > 5)) {
    throw new Error('Invalid popularity provided. Allowed values: 0-5');
  }

  const { tags, ...cardFields } = cardData;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const newCard = await cardRepository.createCard(cardFields, client);

    if (tags && Array.isArray(tags)) {
      const finalTagIds = [];
      for (const tag of tags) {
        if (isUUID(tag)) {
          finalTagIds.push(tag);
        } else {
          const newTag = await tagRepository.createTag(cardData.user_id, tag, client);
          finalTagIds.push(newTag.id);
        }
      }

      await cardTagRepository.linkCardTags(newCard.id, finalTagIds, client);
    }

    await client.query('COMMIT');
    return newCard;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const getCards = async (filters, page = 1, limit = 12) => {
  if (!filters.user_id) throw new Error('User ID is required');
  const offset = (page - 1) * limit;
  const result = await cardRepository.getCardsByUserId(filters, limit, offset);

  return {
    data: result.data,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(result.total / limit),
      totalItems: parseInt(result.total),
      limit: limit,
    },
  };
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

  if (
    updateData.level &&
    updateData.level !== '' &&
    !['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(updateData.level)
  ) {
    throw new Error('Invalid level provided. Allowed values: A1, A2, B1, B2, C1, C2');
  }
  if (updateData.popularity && (updateData.popularity < 0 || updateData.popularity > 5)) {
    throw new Error('Invalid popularity provided. Allowed values: 0-5');
  }

  const { tags, ...updateFields } = updateData;
  const client = await pool.connect();
  let updatedCard;

  try {
    await client.query('BEGIN');

    updatedCard = await cardRepository.updateCard(id, user_id, updateFields, client);
    if (!updatedCard) {
      await client.query('ROLLBACK');
      throw new Error('Card not found or unauthorized');
    }

    if (tags && Array.isArray(tags)) {
      const finalTagIds = [];
      for (const tag of tags) {
        if (isUUID(tag)) {
          finalTagIds.push(tag);
        } else {
          // It's a plain text new tag
          const newTag = await tagRepository.createTag(user_id, tag, client);
          finalTagIds.push(newTag.id);
        }
      }

      await cardTagRepository.linkCardTags(id, finalTagIds, client);
    }

    await client.query('COMMIT');
    return updatedCard;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const deleteCard = async (id, user_id) => {
  if (!id || !user_id) throw new Error('ID and User ID are required');

  const isDeleted = await cardRepository.deleteCard(id, user_id);
  if (!isDeleted) {
    throw new Error('Card not found or unauthorized');
  }

  return isDeleted;
};
export const getTrashCards = async (user_id) => {
  if (!user_id) throw new Error('User ID is required');
  return await cardRepository.getDeletedCardsByUserId(user_id);
};

export const restoreCard = async (id, user_id) => {
  if (!id || !user_id) throw new Error('ID and User ID are required');
  const isRestored = await cardRepository.restoreCard(id, user_id);
  if (!isRestored) throw new Error('Card not found in trash or unauthorized');
  return isRestored;
};

export const hardDeleteCard = async (id, user_id) => {
  if (!id || !user_id) throw new Error('ID and User ID are required');
  const isDeleted = await cardRepository.hardDeleteCard(id, user_id);
  if (!isDeleted) throw new Error('Card not found in trash or unauthorized');
  return isDeleted;
};

export const restoreAllCards = async (user_id) => {
  if (!user_id) throw new Error('User ID is required');
  return await cardRepository.restoreAllCards(user_id);
};

export const emptyTrash = async (user_id) => {
  if (!user_id) throw new Error('User ID is required');
  return await cardRepository.emptyTrash(user_id);
};
