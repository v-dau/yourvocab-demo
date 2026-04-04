import rateLimit from 'express-rate-limit';

export const aiRateLimiter = rateLimit({
  windowMs: 3000, // 3 giây
  max: 1, // giới hạn 1 request mỗi 3s trên một IP
  message: {
    success: false,
    message: 'rate_limit_error',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
