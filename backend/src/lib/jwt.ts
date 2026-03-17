// Node modules
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

// Custom modules
import config from '../config/env.js';

export const genAccessToken = (userId: Types.ObjectId): string => {
  return jwt.sign({ userId }, config.JWT_ACCESS_SECRET, {
    expiresIn: '8h',
    subject: 'access',
  });
};

export const genRefreshToken = (userId: Types.ObjectId): string => {
  return jwt.sign({ userId }, config.JWT_REFRESH_SECRET, {
    expiresIn: '1w',
    subject: 'refresh',
  });
};
