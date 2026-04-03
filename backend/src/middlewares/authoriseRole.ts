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
          success: false,
        });
        return;
      }

      if (!allowedRoles.includes(user.role)) {
        res.status(403).json({
          code: 'Forbidden',
          message: 'Unauthorised request',
          success: false,
        });
        return;
      }

      return next();
    } catch (error) {
      console.error('Error authorising user role, ', error);
      res.status(500).json({
        code: 'ServerError',
        message: 'Internal server error',
        success: false,
      });
    }
  };
};

export default authoriseRole;
