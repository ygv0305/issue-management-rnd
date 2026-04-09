/**
 * @fileoverview Controller module handling password setup requests.
 * Validates a verification token, then sets or updates the user's password.
 * Supports both admin account creation and regular user password updates.
 */

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

// Utils
import { validateReqEmail } from '../../utils/validateReqEmail.js';

/**
 * Validation rules for the set password request body.
 * - `token`: Must not be empty (the verification token).
 * - `password`: Required, must be between 8 and 50 characters.
 */
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
 *
 * @param {Request} req - Express request object containing email, token, and password in the body.
 * @param {Response} res - Express response object used to send back the result.
 * @returns {Promise<void>} A promise that resolves when the response is sent.
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

/**
 * Middleware pipeline for the set password endpoint.
 * Runs email validation, body validation, error handling, and the set password controller.
 */
export default [
  validateReqEmail,
  setPasswordRules,
  validationError,
  setPassword,
];
