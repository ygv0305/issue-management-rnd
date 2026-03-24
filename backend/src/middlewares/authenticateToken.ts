// Node modules
import jwt from 'jsonwebtoken';

// Custom modules
import { verifyAccessToken } from '../lib/jwt.js';

// Types
import type { Request, Response, NextFunction } from 'express';
import type { Types } from 'mongoose';

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // If there is no Bearer token, respond with 401 Unauthorised
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({
      code: 'AuthenticationError',
      message: 'Access denied, no token provided',
    });
    return;
  }

  // Split the token from Bearer prefix
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
        code: 'Unauthorized',
        message: 'Refresh token invalid or expired',
      });
      return;
    }

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });
  }
};

export default authenticateToken;
