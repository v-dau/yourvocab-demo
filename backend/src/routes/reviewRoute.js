import express from 'express';
import * as reviewController from '../controllers/reviewController.js';
import { protectedRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/due', protectedRoute, reviewController.getDueReviews);
router.post('/:id/finish', protectedRoute, reviewController.finishReview);

export default router;
