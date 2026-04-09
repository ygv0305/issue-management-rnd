/**
 * @fileoverview Service module handling user login authentication including
 * password verification and session (JWT) creation.
 */

// Node modules
import bcrypt from 'bcrypt';

// Models
import User from '../../models/userSchema.js';
import RefreshToken from '../../models/refreshTokenSchema.js';

// Lib
import { genAccessToken, genRefreshToken } from '../../lib/jwt.js';

/**
 * Verifies a user's credentials by looking up the email and comparing
 * the provided password against the stored bcrypt hash.
 *
 * @param email - The user's email address.
 * @param password - The plaintext password to verify.
 * @returns The user document if credentials are valid, otherwise null.
 * @async
 */
export const verifyUser = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select('+password').lean().exec();
  if (!user) return null;

  if (user.password) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;
  } else {
    return null;
  }

  return user;
};

/**
 * Generates a new access/refresh token pair and persists the refresh token
 * in the database with a 7-day expiration.
 *
 * @param userId - The MongoDB ObjectId of the authenticated user.
 * @returns An object containing the access token and refresh token strings.
 * @async
 */
export const createSession = async (userId: any) => {
  const accessToken = genAccessToken(userId);
  const refreshToken = genRefreshToken(userId);

  // Save refresh token
  await RefreshToken.create({
    userId,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });

  return { accessToken, refreshToken };
};
