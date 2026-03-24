// Types
import type { Request, Response, NextFunction } from 'express';

// Models
import User from '../models/userSchema.js';

const authoriseRole = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;

    try {
      const user = await User.findById(userId).select('role').lean().exec();
      if (!user) {
        res.status(404).json({
          code: 'NotFound',
          message: 'User not found',
        });
        return;
      }

      if (!allowedRoles.includes(user.role)) {
        res.status(403).json({
          code: 'Forbidden',
          message: 'Unauthorised request: Incorrect user role',
        });
        return;
      }

      return next();
    } catch (error) {
      res.status(500).json({
        code: 'ServerError',
        message: 'Internal server error',
        error: error,
      });
    }
  };
};

export default authoriseRole;
