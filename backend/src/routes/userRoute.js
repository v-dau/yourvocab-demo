import express from 'express';
import { protectedRoute } from '../middlewares/authMiddleware.js';
import { upload } from '../utils/upload.js';
import {
  autMe,
  test,
  changeAvatar,
  changePassword,
  changeEmail,
  updateSettings,
  getSettings,
} from '../controllers/userController.js';

const router = express.Router();

// ============== API QUẢN LÝ THÔNG TIN CÁ NHÂN ==============
// Yêu cầu token hợp lệ cho mọi api này
router.use('/me', protectedRoute);

router.get('/me', autMe);

// 1. Thay đổi Avatar
router.patch('/me/avatar', upload.single('avatar'), changeAvatar);

// 2. Thay đổi Password
router.patch('/me/password', changePassword);

// 3. Thay đổi Email
router.patch('/me/email', changeEmail);

// 4. Update các Settings Users
router.patch('/me/settings', updateSettings);
router.get('/me/settings', getSettings);

// Test
router.get('/test', test);

export default router;

