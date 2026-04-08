/**
 * @fileoverview Controller module handling email/password login requests.
 * Validates user credentials, creates an authentication session, and returns
 * an access token along with a refresh token stored in an HTTP-only cookie.
 */

// Types
import type { Request, Response } from 'express';

// Node modules
import { body } from 'express-validator';

// Services
import * as requestLoginService from '../../services/auth/requestLoginService.js';

// Middlewares
import validationError from '../../middlewares/validationError.js';

// Config
import config from '../../config/env.js';

// Utils
import { validateReqEmail } from '../../utils/validateReqEmail.js';

/**
 * Validation rules for the login request body.
 * - `password`: Must not be empty.
 */
export const requestLoginRules = [
  body('password').notEmpty().withMessage('Password is required'),
];

/**
 * Handles the login request by verifying user credentials, creating a session,
 * and setting a refresh token cookie for persistent authentication.
 *
 * @param {Request} req - Express request object containing email and password in the body.
 * @param {Response} res - Express response object used to send back the login result and set cookies.
 * @returns {Promise<void>} A promise that resolves when the response is sent.
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

/**
 * Middleware pipeline for the login endpoint.
 * Runs email validation, request body validation, error handling, and the login controller.
 */
export default [
  validateReqEmail,
  requestLoginRules,
  validationError,
  requestLogin,
];
