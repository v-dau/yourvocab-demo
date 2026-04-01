import rateLimit from 'express-rate-limit';

export const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 phút
  max: 3, // giới hạn 3 requests mỗi phút trên một IP
  message: {
    success: false,
    message: 'Bạn đang yêu cầu quá nhanh. Vui lòng thử lại sau 1 phút.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
