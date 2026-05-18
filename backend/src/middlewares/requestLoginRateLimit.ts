// Node modules
import rateLimit from 'express-rate-limit';
import type { Request, Response } from 'express';

const requestLoginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, res: Response) => {
    res.status(429).json({
      message: 'Too many login attempts. Please try again later.',
      success: false,
    });
  },
});

export default requestLoginRateLimit;
