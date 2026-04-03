// Types
import type { Request, Response } from 'express';

// Node modules
import { body } from 'express-validator';

// Services
import * as forgotPasswordService from '../../services/auth/forgotPasswordService.js';

// Middlewares
import validationError from '../../middlewares/validationError.js';

// Utils
import { validateReqEmail } from '../../utils/validateReqEmail.js';

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
    console.error('Error handling forgot password, ', error);
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      success: false,
    });
  }
};

export default [validateReqEmail, validationError, forgotPassword];
