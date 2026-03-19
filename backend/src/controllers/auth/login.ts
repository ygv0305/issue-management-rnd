// Types
import type { Request, Response } from 'express';

// Node modules
import bcrypt from 'bcrypt';

// Models
import User from '../../models/user.js';
import RefreshToken from '../../models/refresh-token.js';

// Custom modules
import { genAccessToken, genRefreshToken } from '../../lib/jwt.js';
import config from '../../config/env.js';

const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({
        code: 'Unauthorized',
        message: 'Invalid email or password',
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({
        code: 'Unauthorized',
        message: 'Invalid email or password',
      });
      return;
    }

    const accessToken = genAccessToken(user._id);
    const refreshToken = genRefreshToken(user._id);

    // Save refresh token
    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    // Send HTTP-Only cookie
    const devMode = config.NODE_ENV === 'development';
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: !devMode,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      // path: '',
    });

    res.status(200).json({
      message: 'Login successful',
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });
  }
};

export default login;
