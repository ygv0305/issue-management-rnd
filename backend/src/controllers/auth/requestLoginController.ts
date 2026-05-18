/**
 * @fileoverview Controller module handling email/password login requests.
 * Validates user credentials, creates an authentication session, and returns
 * an access token along with a refresh token stored in an HTTP-only cookie.
 */

// Node modules
import { body } from 'express-validator';
import type { Request, Response } from 'express';

// Services
import * as requestLoginService from '../../services/auth/requestLoginService.js';

// Middlewares
import validationError from '../../middlewares/validationError.js';

// Config
import config from '../../config/env.js';

// Utils
import { validateReqEmail } from '../../utils/validateReqEmail.js';

export const requestLoginRules = [
  body('password').notEmpty().withMessage('Password is required'),
];

/**
 * Handles the login request by verifying user credentials, creating a session,
 * and setting a refresh token cookie for persistent authentication.
 */
const requestLogin = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await requestLoginService.verifyUser(email, password);
    if (!user) {
      res.status(401).json({
        message: 'Invalid email or password',
        success: false,
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
      success: true,
      accessToken,
    });
  } catch (error) {
    console.error('Error requesting to log in, ', error);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

export default [
  validateReqEmail,
  requestLoginRules,
  validationError,
  requestLogin,
];
