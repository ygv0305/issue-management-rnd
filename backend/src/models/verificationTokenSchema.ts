/**
 * @fileoverview Verification token schema definition.
 * Defines the structure for storing email verification tokens used during the
 * user registration/password reset flow. Tokens expire automatically via MongoDB TTL.
 * @module models/verificationTokenSchema
 */

// Node modules
import { Schema, model } from 'mongoose';

export interface IVerificationToken {
  // The email address this verification token is for
  email: string;
  token: string;
  // Expiration date/time for the token (MongoDB TTL index auto-deletes)
  expiresAt: Date;
}

const verificationTokenSchema = new Schema<IVerificationToken>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    token: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      expires: 0, // TTL index: document expires at the exact time of `expiresAt`
    },
  },
  { timestamps: true },
);

verificationTokenSchema.index({ token: 1 }, { unique: true });

export default model<IVerificationToken>(
  'VerificationToken',
  verificationTokenSchema,
);
