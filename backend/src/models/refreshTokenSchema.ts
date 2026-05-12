/**
 * @fileoverview Refresh token schema definition.
 * Defines the structure for storing JWT refresh tokens, enabling token-based
 * session management with automatic expiration via MongoDB TTL indexes.
 * @module models/refreshTokenSchema
 */

// Node modules
import { Schema, model, Types } from 'mongoose';

interface IRefreshToken {
  token: string;
  userId: Types.ObjectId;
  // Expiration date/time for the token (MongoDB TTL index auto-deletes)
  expiresAt: Date;
}

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
    expires: 0, // TTL index: document expires at the exact time of `expiresAt`
  },
});

refreshTokenSchema.index({ token: 1 }, { unique: true });

export default model<IRefreshToken>('RefreshToken', refreshTokenSchema);
