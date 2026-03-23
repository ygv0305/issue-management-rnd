// Node modules
import bcrypt from 'bcrypt';

// Models
import User from '../../models/userSchema.js';
import RefreshToken from '../../models/refreshTokenSchema.js';

// Custom modules
import { genAccessToken, genRefreshToken } from '../../lib/jwt.js';

export const verifyUser = async (email: string, password?: string) => {
  const user = await User.findOne({ email }).select('+password').lean().exec();
  if (!user) return null;

  if (password) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;
  }

  return user;
};

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
