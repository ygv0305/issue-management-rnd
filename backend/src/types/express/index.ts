/**
 * @fileoverview Express type augmentation.
 * Extends the Express Request interface to include the custom `userId` property
 * that is attached by the authenticateToken middleware after successful JWT verification.
 * @module types/express
 */

// Node modules
import { Types } from 'mongoose';

declare module 'express-serve-static-core' {
  interface Request {
    // User ID extracted from the verified JWT access token
    userId: Types.ObjectId;
  }
}
