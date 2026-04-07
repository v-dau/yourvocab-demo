import express from 'express';
import { protectedRoute } from '../middlewares/authMiddleware.js';
import * as feedbackController from '../controllers/feedbackController.js';

const router = express.Router();

router.post('/', protectedRoute, feedbackController.createFeedback);
router.get('/', protectedRoute, feedbackController.getUserFeedbacks);

export default router;
