// Types
import type { Request, Response } from 'express';

// Node modules
import { cookie } from 'express-validator';
import jwt from 'jsonwebtoken';

// Services
import * as tokenService from '../../services/auth/tokenService.js';

// Middlewares
import validationError from '../../middlewares/validationError.js';

export const renewTokenRules = [
  cookie('refreshToken')
    .notEmpty()
    .withMessage('Refresh token required')
    .isJWT()
    .withMessage('Invalid refresh token'),
];

const renewToken = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies.refreshToken as string;
  if (!refreshToken) {
    res.status(401).json({
      code: 'Unauthorized',
      message: 'Refresh token missing',
    });
    return;
  }

  try {
    const accessToken = await tokenService.verifyAndRenewToken(refreshToken);

    if (!accessToken) {
      res.status(401).json({
        code: 'Unauthorized',
        message: 'Invalid refresh token',
      });
      return;
    }

    res.status(200).json({
      accessToken,
    });
  } catch (error) {
    if (
      error instanceof jwt.TokenExpiredError ||
      error instanceof jwt.JsonWebTokenError
    ) {
      res.status(401).json({
        code: 'Unauthorized',
        message: 'Refresh token invalid or expired',
      });
      // Delete from database if expired
      await tokenService.removeRefreshToken(refreshToken);
      return;
    }

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });
  }
};

export default [renewTokenRules, validationError, renewToken];
