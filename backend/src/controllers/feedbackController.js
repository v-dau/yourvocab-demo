import * as feedbackService from '../services/feedbackService.js';

export const createFeedback = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Content is required' });
    }

    const newFeedback = await feedbackService.createFeedbackService(userId, title, content);
    res
      .status(201)
      .json({ success: true, data: newFeedback, message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error creating feedback: ', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};

export const getUserFeedbacks = async (req, res) => {
  try {
    const userId = req.user.id;
    const feedbacks = await feedbackService.getUserFeedbacksService(userId);
    res.status(200).json({ success: true, data: feedbacks });
  } catch (error) {
    console.error('Error fetching user feedbacks: ', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
