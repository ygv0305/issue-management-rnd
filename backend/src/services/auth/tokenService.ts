// Models
import RefreshToken from '../../models/refreshToken.js';

// Custom modules
import { genAccessToken, verifyRefreshToken } from '../../lib/jwt.js';
import type { Types } from 'mongoose';

export const verifyAndRenewToken = async (refreshToken: string) => {
  // Verify token
  const decoded = verifyRefreshToken(refreshToken) as {
    userId: Types.ObjectId;
  };

  // Verify token exists in database
  const tokenDoc = await RefreshToken.findOne({
    token: refreshToken,
    userId: decoded.userId,
  });
  if (!tokenDoc) return null;

  // Generate new accessToken
  const accessToken = genAccessToken(decoded.userId);
  return accessToken;
};

export const removeRefreshToken = async (refreshToken: string) => {
  await RefreshToken.deleteOne({ token: refreshToken });
};
