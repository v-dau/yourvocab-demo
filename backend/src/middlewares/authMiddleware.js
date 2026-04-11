import jwt from 'jsonwebtoken';
import * as userRepository from '../repositories/userRepository.js';
import { checkAndUpdatedUserBanStatus } from '../services/banService.js';

//phân quyền - xác định người dùng là ai
export const protectedRoute = (req, res, next) => {
  try {
    //lấy access token từ header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token not found' });
    }

    //xác thực access token
    jwt.verify(token, process.env.JWT_ACCESS_SECRET, async (err, decodedPayload) => {
      if (err) {
        console.error('Error verifying JWT: ', err.message);
        return res.status(403).json({ message: 'The access token is expired or incorrect' });
      }

      //tìm user có id được đính trong token khi đăng nhập
      const user = await userRepository.findById(decodedPayload.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (user.is_banned) {
        const banStatus = await checkAndUpdatedUserBanStatus(user.id);
        if (banStatus.isBanned) {
          return res.status(403).json({
            code: 'USER_BANNED',
            message: 'Tài khoản của bạn đã bị khóa',
            details: { reason: banStatus.reason, expiry: banStatus.expiry },
          });
        }
      }

      //xóa trường password trước khi đính vào request
      delete user.password_hash;

      req.user = user;

      next();
    });
  } catch (error) {
    console.error('Error verifying JWT in authMiddleware', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// middleware ngăn user/admin (những người đã đăng nhập) gọi lại API đăng nhập/đăng ký
export const guestRoute = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decodedPayload) => {
      if (!err && decodedPayload) {
        // Đã có token hợp lệ, không cho phép truy cập
        return res.status(403).json({ message: 'You are already logged in' });
      }
      // Nếu token hết hạn hoặc lỗi, vứt bỏ và cho phép đi tiếp (như người dùng chưa đăng nhập)
      next();
    });
  } else {
    next();
  }
};
