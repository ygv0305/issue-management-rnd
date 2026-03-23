// Types
import type { Request, Response } from 'express';

// Node modules
import { body } from 'express-validator';

// Services
import * as requestLoginService from '../../services/auth/requestLoginService.js';

// Custom modules
import validationError from '../../middlewares/validationError.js';
import config from '../../config/env.js';

export const requestLoginRules = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

const requestLogin = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await requestLoginService.verifyUser(email, password);
    if (!user) {
      res.status(401).json({
        code: 'Unauthorized',
        message: 'Invalid email or password',
      });
      return;
    }

    const { accessToken, refreshToken } =
      await requestLoginService.createSession(user._id);

    // Send HTTP-Only cookie
    const devMode = config.NODE_ENV === 'development';
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: !devMode,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: 'Login successful',
      accessToken,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });
  }
};

export default [requestLoginRules, validationError, requestLogin];
