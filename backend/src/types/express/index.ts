/**
 * @fileoverview Express type augmentation.
 * Extends the Express Request interface to include the custom `userId` property
 * that is attached by the authenticateToken middleware after successful JWT verification.
 * @module types/express
 */

// Node modules
import * as express from 'express';

// Types
import { Types } from 'mongoose';

/**
 * Global namespace augmentation for Express Request interface.
 * Adds the `userId` property which is set by the authentication middleware.
 */
declare global {
  namespace Express {
    interface Request {
      /** User ID extracted from the verified JWT access token */
      userId: Types.ObjectId;
    }
  }
}
