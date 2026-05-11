/**
 * @fileoverview Controller module handling access token renewal requests.
 * Validates the refresh token from cookies and issues a new access token
 * if the refresh token is still valid and not expired.
 */

// Node modules
import type { Request, Response } from 'express';
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

/**
 * Handles the token renewal request by verifying the refresh token,
 * generating a new access token, and cleaning up expired tokens.
 */
const renewToken = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies.refreshToken as string;
  if (!refreshToken) {
    res.status(400).json({
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
        message: 'Refresh token invalid or expired',
        success: false,
      });
      // Delete from database if expired
      await renewTokenService.removeRefreshToken(refreshToken);
      return;
    }

    console.error('Error renewing access token, ', error);
    res.status(500).json({
      message: 'Internal server error',
      success: true,
    });
  }
};

export default [renewTokenRules, validationError, renewToken];
