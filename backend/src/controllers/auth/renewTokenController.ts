// Types
import type { Request, Response } from 'express';

// Node modules
import { cookie } from 'express-validator';
import jwt from 'jsonwebtoken';

// Services
import * as renewTokenService from '../../services/auth/renewTokenService.js';

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
    res.status(400).json({
      code: 'BadRequest',
      message: 'Refresh token missing',
      success: false,
    });
    return;
  }

  try {
    const accessToken =
      await renewTokenService.verifyAndRenewToken(refreshToken);

    if (!accessToken) {
      res.status(401).json({
        code: 'Unauthorized',
        message: 'Invalid refresh token',
        success: false,
      });
      return;
    }

    res.status(200).json({
      success: true,
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
        success: false,
      });
      // Delete from database if expired
      await renewTokenService.removeRefreshToken(refreshToken);
      return;
    }

    console.error('Error renewing access token, ', error);
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      success: true,
    });
  }
};

export default [renewTokenRules, validationError, renewToken];
