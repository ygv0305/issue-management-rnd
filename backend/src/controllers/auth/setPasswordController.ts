// Types
import type { Request, Response } from 'express';

// Node modules
import { body } from 'express-validator';

// Services
import * as setPasswordService from '../../services/auth/setPasswordService.js';

// Middlewares
import validationError from '../../middlewares/validationError.js';

// Config
import config from '../../config/env.js';

export const setPasswordRules = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('token').notEmpty().withMessage('Token is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

const setPassword = async (req: Request, res: Response): Promise<void> => {
  const { email, token, password } = req.body;
  try {
    // Check if token exists and is valid
    const verificationToken = await setPasswordService.verifyToken(
      email,
      token,
    );
    if (!verificationToken) {
      res.status(400).json({
        code: 'InvalidToken',
        message: 'The token is invalid or has expired',
      });
      return;
    }

    if (email === config.ADMIN_MAIL) {
      // Create Admin account
      await setPasswordService.createAdmin(email, password);
    } else {
      // User exists, just update their password
      const user = await setPasswordService.updatePassword(email, password);
      if (!user) {
        res.status(404).json({
          code: 'UserNotFound',
          message: 'User does not exist anymore',
        });
        return;
      }
    }

    // Delete token so it can't be reused
    await setPasswordService.deleteToken(verificationToken._id);

    res.status(200).json({
      message: 'Password has been set successfully',
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });
  }
};

export default [setPasswordRules, validationError, setPassword];
