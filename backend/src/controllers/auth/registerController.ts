/**
 * @fileoverview Controller module handling user registration requests.
 * Validates the email, checks if the user exists, generates a verification
 * token, and sends a verification email to the user.
 */

// Types
import type { Request, Response } from 'express';

// Services
import * as registerService from '../../services/auth/registerService.js';

// Middlewares
import validationError from '../../middlewares/validationError.js';

// Config
import config from '../../config/env.js';

// Utils
import { validateReqEmail } from '../../utils/validateReqEmail.js';

/** Represents the expected shape of the registration request body. */
interface RegisterData {
  email: string;
}

/**
 * Handles the registration request by verifying the user exists,
 * generating a verification token, and sending a verification email.
 *
 * @param {Request} req - Express request object containing the user's email in the body.
 * @param {Response} res - Express response object used to send back the registration result.
 * @returns {Promise<void>} A promise that resolves when the response is sent.
 */
const register = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body as RegisterData;
  try {
    // Check if user exists
    const existingUser = await registerService.checkUserExist(email);
    if (!existingUser && email !== config.ADMIN_MAIL) {
      res.status(404).json({
        message: 'Account with this email does not exist',
        success: false,
      });
      return;
    }

    // Generate and save token
    const token = await registerService.generateAndSaveToken(email);

    // Send email
    await registerService.sendVerificationEmail(email, token);

    res.status(200).json({
      message: 'A verification link has been sent to your email address.',
      success: true,
    });
  } catch (error) {
    console.error('Error registering user, ', error);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

/**
 * Middleware pipeline for the registration endpoint.
 * Runs email validation, error handling, and the register controller in sequence.
 */
export default [validateReqEmail, validationError, register];
