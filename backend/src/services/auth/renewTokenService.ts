/**
 * @fileoverview Service module handling access token renewal using a valid
 * refresh token.
 */

// Models
import RefreshToken from '../../models/refreshTokenSchema.js';

// Lib
import { genAccessToken, verifyRefreshToken } from '../../lib/jwt.js';

// Types
import type { Types } from 'mongoose';

/**
 * Verifies the provided refresh token (both signature and database presence)
 * and generates a new access token.
 *
 * @param refreshToken - The refresh token string to verify and renew.
 * @returns A new access token string if verification succeeds, otherwise null.
 * @async
 * @throws May throw if the refresh token signature is invalid or expired.
 */
export const verifyAndRenewToken = async (refreshToken: string) => {
  // Verify token
  const decoded = verifyRefreshToken(refreshToken) as {
    userId: Types.ObjectId;
  };

  // Verify token exists in database
  const tokenDoc = await RefreshToken.findOne({
    token: refreshToken,
    userId: decoded.userId,
  })
    .lean()
    .exec();
  if (!tokenDoc) return null;

  // Generate new accessToken
  const accessToken = genAccessToken(decoded.userId);
  return accessToken;
};

/**
 * Removes a refresh token from the database, typically called after it
 * has been used to prevent replay attacks.
 *
 * @param refreshToken - The refresh token string to remove.
 * @async
 */
export const removeRefreshToken = async (refreshToken: string) => {
  await RefreshToken.deleteOne({ token: refreshToken });
};
