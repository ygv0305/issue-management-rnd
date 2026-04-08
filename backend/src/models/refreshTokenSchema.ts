/**
 * @fileoverview Refresh token schema definition.
 * Defines the structure for storing JWT refresh tokens in MongoDB, enabling
 * token-based session management with automatic expiration via MongoDB TTL indexes.
 * @module models/refreshTokenSchema
 */

// Node modules
import { Schema, model, Types } from 'mongoose';

/**
 * Interface representing a refresh token document in the database.
 * Used for maintaining user sessions beyond the short-lived access token.
 * @interface
 */
interface IRefreshToken {
  /** The JWT refresh token string */
  token: string;
  /** Reference to the user this token belongs to */
  userId: Types.ObjectId;
  /** Expiration date/time for the token (MongoDB TTL index auto-deletes) */
  expiresAt: Date;
}

/** Mongoose schema for RefreshToken documents with TTL-based auto-expiration */
const refreshTokenSchema = new Schema<IRefreshToken>({
  token: {
    type: String,
    required: [true, 'Token is required'],
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: [true, 'User ID is required'],
  },
  expiresAt: {
    type: Date,
    required: true,
    expires: 0,
  },
});

/** Mongoose model for RefreshToken documents */
export default model<IRefreshToken>('RefreshToken', refreshTokenSchema);
