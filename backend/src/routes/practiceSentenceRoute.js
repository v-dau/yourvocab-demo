import express from 'express';
import * as practiceSentenceController from '../controllers/practiceSentenceController.js';

const router = express.Router();

// Get all sentences of a specific card
router.get('/cards/:cardId/sentences', practiceSentenceController.getSentencesByCardId);

// Create a new sentence for a specific card
router.post('/cards/:cardId/sentences', practiceSentenceController.createSentence);

// Update a sentence by ID
router.put('/sentences/:id', practiceSentenceController.updateSentence);

// Delete a sentence by ID
router.delete('/sentences/:id', practiceSentenceController.deleteSentence);

export default router;
