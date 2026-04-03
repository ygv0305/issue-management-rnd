// Types
import type { Request, Response } from 'express';

// Node modules
import { body } from 'express-validator';

// Services
import * as registerService from '../../services/auth/registerService.js';

// Middlewares
import validationError from '../../middlewares/validationError.js';

// Config
import config from '../../config/env.js';

export const registerRules = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isLength({ max: 50 })
    .withMessage('Email must be less than 50 characters')
    .isEmail()
    .withMessage('Invalid email address')
    // Ensure only domain ends with @autuni.ac.nz
    .custom((value) => {
      if (!value.endsWith('@autuni.ac.nz')) {
        throw new Error('You must register with a valid @autuni.ac.nz address');
      }
      return true;
    }),
];

interface RegisterData {
  email: string;
}

const register = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body as RegisterData;
  try {
    // Check if user exists
    const existingUser = await registerService.checkUserExist(email);
    if (!existingUser && email !== config.ADMIN_MAIL) {
      res.status(404).json({
        code: 'UserNotFound',
        message: 'Account with this email does not exist',
      });
      return;
    }

    // Generate and save token
    const token = await registerService.generateAndSaveToken(email);

    // Send email
    await registerService.sendVerificationEmail(email, token);

    res.status(200).json({
      message: 'A verification link has been sent to your email address.',
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });
  }
};

export default [registerRules, validationError, register];
