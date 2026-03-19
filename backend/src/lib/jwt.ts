// Node modules
import jwt from 'jsonwebtoken';

// Types
import { Types } from 'mongoose';

// Custom modules
import config from '../config/env.js';

export const genAccessToken = (userId: Types.ObjectId): string => {
  return jwt.sign({ userId }, config.JWT_ACCESS_SECRET, {
    expiresIn: '1h',
    subject: 'access',
  });
};

export const genRefreshToken = (userId: Types.ObjectId): string => {
  return jwt.sign({ userId }, config.JWT_REFRESH_SECRET, {
    expiresIn: '1w',
    subject: 'refresh',
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, config.JWT_ACCESS_SECRET, {
    subject: 'access',
  });
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, config.JWT_REFRESH_SECRET, {
    subject: 'refresh',
  });
};
