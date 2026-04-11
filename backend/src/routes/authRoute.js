import express from 'express';
import { signUp, signIn, signOut, refreshToken } from '../controllers/authController.js';
import { guestRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signup', guestRoute, signUp);
router.post('/signin', guestRoute, signIn);
router.post('/signout', signOut);
router.post('/refresh', refreshToken);

export default router;
