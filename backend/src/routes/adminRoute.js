import express from 'express';
import { protectedRoute } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/adminMiddleware.js';
import {
  getStats,
  getUsers,
  banUser,
  unbanUser,
  getBanInfo,
  changePassword,
  getFeedbacks,
  markFeedbackRead,
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/stats', protectedRoute, isAdmin, getStats);

router.get('/users', protectedRoute, isAdmin, getUsers);
router.post('/users/:id/ban', protectedRoute, isAdmin, banUser);
router.post('/users/:id/unban', protectedRoute, isAdmin, unbanUser);
router.get('/users/:id/ban-info', protectedRoute, isAdmin, getBanInfo);
router.post('/users/:id/change-password', protectedRoute, isAdmin, changePassword);

router.get('/feedbacks', protectedRoute, isAdmin, getFeedbacks);
router.put('/feedbacks/:id/read', protectedRoute, isAdmin, markFeedbackRead);

export default router;
