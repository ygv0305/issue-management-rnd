// Node modules
import { Router } from 'express';
import { body, cookie } from 'express-validator';

// Controllers
import register from '../controllers/auth/register.js';
import forgotPassword from '../controllers/auth/forgotPassword.js';
import setPassword from '../controllers/auth/setPassword.js';
import login from '../controllers/auth/login.js';
import logout from '../controllers/auth/logout.js';
import renewToken from '../controllers/auth/renew-token.js';

// Middlewares
import validationError from '../middlewares/validationError.js';
import authenticate from '../middlewares/authenticate.js';

const router = Router();

router.post(
  '/login',
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required'),
  validationError,
  login,
);

router.post('/logout', authenticate, logout);

router.post(
  '/renew-token',
  cookie('refreshToken')
    .notEmpty()
    .withMessage('Refresh token required')
    .isJWT()
    .withMessage('Invalid refresh token'),
  validationError,
  renewToken,
);

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
    // Ensure only domain ends with @aut.ac.nz
    .custom((value) => {
      if (!value.endsWith('@autuni.ac.nz')) {
        throw new Error('You must register with a valid @autuni.ac.nz address');
      }
      return true;
    }),
  validationError,
  register,
);

router.post(
  '/forgot-password',
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address'),
  validationError,
  forgotPassword,
);

router.post(
  '/set-password',
  body('email').isEmail().withMessage('Invalid email address'),
  body('token').notEmpty().withMessage('Token is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  validationError,
  setPassword,
);

export default router;
