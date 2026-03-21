// Types
import type { Request, Response } from 'express';

// Node modules
import { body } from 'express-validator';

// Services
import * as forgotPasswordService from '../../services/auth/forgotPasswordService.js';

// Middlewares
import validationError from '../../middlewares/validationError.js';

export const forgotPasswordRules = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address'),
];

interface ForgotPasswordData {
  email: string;
}

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
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });
  }
};

export default [forgotPasswordRules, validationError, forgotPassword];
