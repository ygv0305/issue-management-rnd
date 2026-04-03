// Node modules
import { validationResult } from 'express-validator';

// Types
import type { Request, Response, NextFunction } from 'express';

const validationError = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      code: 'RequestValidationError',
      errors: errors.mapped(),
      success: false,
    });
    return;
  }
  next();
};

export default validationError;
