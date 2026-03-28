import express from 'express';
import * as cardController from '../controllers/cardController.js';

const router = express.Router();

router.post('/', cardController.createCard);
router.get('/', cardController.getCards);
router.get('/:id', cardController.getCardById);
router.put('/:id', cardController.updateCard);
router.delete('/:id', cardController.deleteCard);

export default router;
