// Types
import type { Request, Response } from 'express';

// Models
import RefreshToken from '../../models/refresh-token.js';

// Custom modules
import { genAccessToken, verifyRefreshToken } from '../../lib/jwt.js';
import type { Types } from 'mongoose';

// Node modules
import jwt from 'jsonwebtoken';

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
    // Verify token
    const decoded = verifyRefreshToken(refreshToken) as {
      userId: Types.ObjectId;
    };

    // Verify token exists in database
    const tokenDoc = await RefreshToken.findOne({
      token: refreshToken,
      userId: decoded.userId,
    });
    if (!tokenDoc) {
      res.status(401).json({
        code: 'Unauthorized',
        message: 'Invalid refresh token',
      });
      return;
    }

    // Generate new accessToken
    const accessToken = genAccessToken(decoded.userId);

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
      await RefreshToken.deleteOne({ token: refreshToken });
      return;
    }

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });
  }
};

export default renewToken;
