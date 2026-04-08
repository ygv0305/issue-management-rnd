import { body } from 'express-validator';

export const validateReqEmail = [
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
