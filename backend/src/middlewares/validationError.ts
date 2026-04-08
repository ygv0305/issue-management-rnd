/**
 * @fileoverview Validation error handling middleware.
 * Checks the result of express-validator validations and returns
 * a 400 Bad Request response with mapped errors if validation fails.
 * Must be placed after validation rules and before the route handler.
 * @module middlewares/validationError
 */

// Node modules
import { validationResult } from 'express-validator';

// Types
import type { Request, Response, NextFunction } from 'express';

/**
 * Express middleware that checks for validation errors from express-validator.
 * If errors exist, returns 400 with mapped error messages. Otherwise, proceeds to next middleware.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
const validationError = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      errors: errors.mapped(),
      success: false,
    });
    return;
  }
  next();
};

export default validationError;
