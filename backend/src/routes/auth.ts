// Node modules
import { Router } from 'express';
import { body } from 'express-validator';

// Controllers
import register from '../controllers/auth/register.js';

// Middlewares
import validationError from '../middlewares/validationError.js';

// Models
import User from '../models/user.js';

const router = Router();

router.post(
  '/register',
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isLength({ max: 50 })
    .withMessage('Email must be less than 50 characters')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async (value) => {
      const userExist = await User.exists({ email: value });
      if (userExist) {
        throw new Error('Invalid user credentials');
      }
    }),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  validationError,
  register,
);

export default router;
