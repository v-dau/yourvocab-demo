import express from 'express';
import { protectedRoute } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/adminMiddleware.js';
import { getStats, getUsers, banUser, unbanUser } from '../controllers/adminController.js';

const router = express.Router();

router.get('/stats', protectedRoute, isAdmin, getStats);

router.get('/users', protectedRoute, isAdmin, getUsers);
router.post('/users/:id/ban', protectedRoute, isAdmin, banUser);
router.post('/users/:id/unban', protectedRoute, isAdmin, unbanUser);

export default router;
