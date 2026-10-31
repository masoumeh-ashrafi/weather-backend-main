import rateLimit from 'express-rate-limit';

// 60 requests per minute per IP — generous for a real user searching cities,
// tight enough to make scripted abuse pointless.
export const weatherRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, slow down.' },
});
