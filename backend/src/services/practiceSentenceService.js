import * as practiceSentenceRepository from '../repositories/practiceSentenceRepository.js';

export const getSentencesByCardId = async (cardId, userId) => {
  try {
    const sentences = await practiceSentenceRepository.getSentencesByCardId(cardId, userId);
    return { data: sentences, status: 200 };
  } catch (error) {
    throw { status: 500, message: error.message };
  }
};

export const createSentence = async (cardId, userId, content) => {
  if (!content || content.trim() === '') {
    throw { status: 400, message: 'Sentence content cannot be empty' };
  }

  try {
    const newSentence = await practiceSentenceRepository.createSentence(
      cardId,
      userId,
      content.trim()
    );
    return { data: newSentence, status: 201 };
  } catch (error) {
    if (error.message === 'CARD_NOT_FOUND_OR_UNAUTHORIZED') {
      throw { status: 404, message: 'Card not found or unauthorized' };
    }
    throw { status: 500, message: error.message };
  }
};

export const updateSentence = async (sentenceId, userId, content) => {
  if (!content || content.trim() === '') {
    throw { status: 400, message: 'Sentence content cannot be empty' };
  }

  try {
    const updatedSentence = await practiceSentenceRepository.updateSentence(
      sentenceId,
      userId,
      content.trim()
    );
    return { data: updatedSentence, status: 200 };
  } catch (error) {
    if (error.message === 'SENTENCE_NOT_FOUND_OR_UNAUTHORIZED') {
      throw { status: 404, message: 'Sentence not found or unauthorized' };
    }
    throw { status: 500, message: error.message };
  }
};

export const deleteSentence = async (sentenceId, userId) => {
  try {
    const deletedSentence = await practiceSentenceRepository.deleteSentence(sentenceId, userId);
    return { data: deletedSentence, status: 200 };
  } catch (error) {
    if (error.message === 'SENTENCE_NOT_FOUND_OR_UNAUTHORIZED') {
      throw { status: 404, message: 'Sentence not found or unauthorized' };
    }
    throw { status: 500, message: error.message };
  }
};
