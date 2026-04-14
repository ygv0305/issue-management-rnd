/**
 * @fileoverview Authentication middleware for verifying JWT access tokens.
 * Extracts the Bearer token from the Authorization header, verifies it,
 * and attaches the user's ID to the request object for downstream use.
 * @module middlewares/authenticateToken
 */

// Node modules
import jwt from 'jsonwebtoken';

// Custom modules
import { verifyAccessToken } from '../lib/jwt.js';

// Types
import type { Request, Response, NextFunction } from 'express';
import type { Types } from 'mongoose';

/**
 * Express middleware that authenticates incoming requests by verifying
 * the JWT access token from the Authorization header's Bearer token.
 * On success, attaches userId to the request object.
 * On failure, returns 401 Unauthorized with an appropriate error message.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // If there is no Bearer token, respond with 401 Unauthorised
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({
      message: 'Access denied, no token provided',
      success: false,
    });
    return;
  }

  // Split the token from Bearer prefix
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, token] = authHeader.split(' ');

  try {
    // Verify token and extract userID from payload
    if (token) {
      const jwtPayload = verifyAccessToken(token) as { userId: Types.ObjectId };
      // Attach userId to the request object
      req.userId = jwtPayload.userId;
    }
    return next();
  } catch (error) {
    if (
      error instanceof jwt.TokenExpiredError ||
      error instanceof jwt.JsonWebTokenError
    ) {
      res.status(401).json({
        message: 'Refresh token invalid or expired',
        success: false,
      });
      return;
    }

    console.error('Error authenticating access token, ', error);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

export default authenticateToken;
