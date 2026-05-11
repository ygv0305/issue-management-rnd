/**
 * @fileoverview Controller module handling forgot password requests.
 * Finds the user by email, generates a password reset token, and sends
 * a reset link via email. Does not reveal whether the user exists for security.
 */

// Node modules
import type { Request, Response } from 'express';

// Services
import * as forgotPasswordService from '../../services/auth/forgotPasswordService.js';

// Middlewares
import validationError from '../../middlewares/validationError.js';

// Utils
import { validateReqEmail } from '../../utils/validateReqEmail.js';

interface ForgotPasswordData {
  email: string;
}

/**
 * Handles the forgot password request by generating a reset token
 * and sending a password reset email to the user.
 */
const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body as ForgotPasswordData;
  try {
    const user = await forgotPasswordService.findUserByEmail(email);
    if (!user) {
      // Don't reveal that the user doesn't exist for security
      res.status(200).json({ message: 'A password reset link has been sent.' });
      return;
    }

    // Generate and save token
    const token = await forgotPasswordService.generateAndSaveResetToken(email);

    // Send email
    await forgotPasswordService.sendResetEmail(email, token);

    res.status(200).json({ message: 'A password reset link has been sent.' });
  } catch (error) {
    console.error('Error handling forgot password, ', error);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

export default [validateReqEmail, validationError, forgotPassword];
