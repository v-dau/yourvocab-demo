import * as feedbackRepository from '../repositories/feedbackRepository.js';

export const createFeedbackService = async (userId, title, content) => {
  if (!title || !title.trim()) {
    throw new Error('Title is required');
  }
  if (!content || !content.trim()) {
    throw new Error('Content is required');
  }

  const newFeedback = await feedbackRepository.createFeedback(userId, title.trim(), content.trim());
  return newFeedback;
};

export const getUserFeedbacksService = async (userId) => {
  const feedbacks = await feedbackRepository.getFeedbacksByUserId(userId);
  return feedbacks;
};
