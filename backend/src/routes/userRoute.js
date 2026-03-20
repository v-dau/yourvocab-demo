import express from 'express';
import { autMe } from '../controllers/userController.js';

const router = express.Router();

router.get('/me', autMe);

export default router;
