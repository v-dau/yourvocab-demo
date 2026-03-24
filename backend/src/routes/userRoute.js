import express from 'express';
import { autMe, test } from '../controllers/userController.js';

const router = express.Router();

router.get('/me', autMe);

router.get('/test', test);

export default router;
