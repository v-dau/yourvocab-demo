import * as practiceSentenceService from '../services/practiceSentenceService.js';

export const getSentencesByCardId = async (req, res) => {
  try {
    const { cardId } = req.params;
    const userId = req.user.id;

    const result = await practiceSentenceService.getSentencesByCardId(cardId, userId);
    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Internal server error' });
  }
};

export const createSentence = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { sentence } = req.body;
    const userId = req.user.id;

    const result = await practiceSentenceService.createSentence(cardId, userId, sentence);
    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Internal server error' });
  }
};

export const updateSentence = async (req, res) => {
  try {
    const { id } = req.params;
    const { sentence } = req.body;
    const userId = req.user.id;

    const result = await practiceSentenceService.updateSentence(id, userId, sentence);
    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Internal server error' });
  }
};

export const deleteSentence = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await practiceSentenceService.deleteSentence(id, userId);
    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Internal server error' });
  }
};
