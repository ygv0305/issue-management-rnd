/**
 * @fileoverview Role-based authorization middleware.
 * Checks the authenticated user's role against a list of allowed roles,
 * returning 403 Forbidden if the user's role is not permitted.
 * @module middlewares/authoriseRole
 */

// Types
import type { Request, Response, NextFunction } from 'express';

// Models
import User from '../models/userSchema.js';

/**
 * Factory function that creates role-based authorization middleware.
 * @param {string[]} allowedRoles - Array of roles that are permitted to access the route
 * @returns {Function} Express middleware function that checks user role
 */
const authoriseRole = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;

    try {
      const user = await User.findById(userId).select('role').lean().exec();
      if (!user) {
        res.status(404).json({
          message: 'User not found',
          success: false,
        });
        return;
      }

      if (!allowedRoles.includes(user.role)) {
        res.status(403).json({
          message: 'Unauthorised request',
          success: false,
        });
        return;
      }

      return next();
    } catch (error) {
      console.error('Error authorising user role, ', error);
      res.status(500).json({
        message: 'Internal server error',
        success: false,
      });
    }
  };
};

export default authoriseRole;
