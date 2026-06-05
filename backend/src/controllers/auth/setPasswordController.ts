/**
 * @fileoverview Controller module handling password setup requests.
 * Validates a verification token, then sets or updates the user's password.
 * Supports both admin account creation and regular user password updates.
 */

// Node modules
import { body } from 'express-validator';
import type { Request, Response } from 'express';

// Services
import * as setPasswordService from '../../services/auth/setPasswordService.js';

// Middlewares
import validationError from '../../middlewares/validationError.js';

// Config
import config from '../../config/env.js';

// Utils
import { validateReqEmail } from '../../utils/validateReqEmail.js';

export const setPasswordRules = [
  body('token').notEmpty().withMessage('Token is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8, max: 50 })
    .withMessage('Password must be between 8 and 50 characters long'),
];

/**
 * Handles the set password request by validating the token and updating
 * the user's password. Creates an admin account if the email matches the
 * configured admin mail.
 */
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
        message: 'The verification token is invalid or has expired',
        success: false,
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
          message: 'User does not exist',
          success: false,
        });
        return;
      }
    }

    // Delete token so it can't be reused
    await setPasswordService.deleteToken(verificationToken._id);

    res.status(200).json({
      message: 'Password has been set successfully',
      success: true,
    });
  } catch (error) {
    console.error('Error setting user password, ', error);
    res.status(500).json({
      message: 'Internal server error',
      success: true,
    });
  }
};

export default [
  validateReqEmail,
  setPasswordRules,
  validationError,
  setPassword,
];
