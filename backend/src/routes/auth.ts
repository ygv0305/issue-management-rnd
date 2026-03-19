// Node modules
import { Router } from 'express';
import { body } from 'express-validator';

// Controllers
import register from '../controllers/auth/register.js';
import forgotPassword from '../controllers/auth/forgotPassword.js';
import setPassword from '../controllers/auth/setPassword.js';
import login from '../controllers/auth/login.js';
// Middlewares
import validationError from '../middlewares/validationError.js';
import user from '../models/user.js';
import authenticateUser from '../controllers/auth/login.js';

const router = Router();

// router.post(
//   '/register',
//   body('email')
//     .trim()
//     .notEmpty()
//     .withMessage('Email is required')
//     .isLength({ max: 50 })
//     .withMessage('Email must be less than 50 characters')
//     .isEmail()
//     .withMessage('Invalid email address')
//     // Ensure only domain ends with @aut.ac.nz
//     .custom((value) => {
//       if (!value.endsWith('@aut.ac.nz')) {
//         throw new Error('You must register with a valid @aut.ac.nz address');
//       }
//       return true;
//     }),
//   validationError,
//   register,
// );

router.post('/register', (req, res) => {
  var email = req.body.email;
  register(email).then((success) => {
    if (success) {
      res.json({ message: 'Verification email sent. Please check your inbox.' });
    } else {
      res.status(400).json({ message: 'Registration failed. Email may already be registered or invalid.' });
    }
  })
});

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

router.post('/set-password',
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

router.post('/login', async (req, res) => {
  res.json({ 
    message: await authenticateUser(req.body.email, req.body.password) 
  });
});

export default router;
