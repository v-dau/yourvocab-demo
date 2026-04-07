import express from 'express';
import { protectedRoute } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/adminMiddleware.js';
import { getStats } from '../controllers/adminController.js';

const router = express.Router();

router.get('/stats', protectedRoute, isAdmin, getStats);

export default router;
