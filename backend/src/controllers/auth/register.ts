// Types
import type { Request, Response } from 'express';

// Node modules
import { body } from 'express-validator';

// Custom modules
import * as registerService from '../../services/auth/registerService.js';
import validationError from '../../middlewares/validationError.js';

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
    // Check if user already exists
    const existingUser = await registerService.checkUserExists(email);
    if (existingUser) {
      res.status(400).json({
        code: 'UserExists',
        message: 'Account with this email already exists',
      });
      return;
    }

    // Generate and save token
    const token = await registerService.generateAndSaveToken(email, 'Register');

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
