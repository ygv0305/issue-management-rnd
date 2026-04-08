/**
 * @fileoverview Email validation rules for request bodies.
 * Defines express-validator middleware rules for validating email input,
 * including format validation and domain restriction to @autuni.ac.nz.
 * @module utils/validateReqEmail
 */

import { body } from 'express-validator';

/**
 * Express-validator validation rules for email fields.
 * - Trims whitespace
 * - Ensures email is not empty
 * - Validates max length of 50 characters
 * - Validates proper email format
 * - Restricts domain to @autuni.ac.nz only
 */
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
