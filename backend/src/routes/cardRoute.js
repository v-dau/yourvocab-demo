import express from 'express';
import * as cardController from '../controllers/cardController.js';

const router = express.Router();

router.get('/trash', cardController.getTrashCards);
router.post('/trash/restore-all', cardController.restoreAllCards);
router.delete('/trash/empty', cardController.emptyTrash);
router.post('/:id/restore', cardController.restoreCard);
router.delete('/:id/hard', cardController.hardDeleteCard);

router.post('/', cardController.createCard);
router.get('/', cardController.getCards);
router.get('/:id', cardController.getCardById);
router.put('/:id', cardController.updateCard);
router.delete('/:id', cardController.deleteCard);

export default router;
