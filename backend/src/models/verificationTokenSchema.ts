/**
 * @fileoverview Verification token schema definition.
 * Defines the structure for storing email verification tokens used during the
 * user registration/password reset flow. Tokens expire automatically via MongoDB TTL.
 * @module models/verificationTokenSchema
 */

// Node modules
import { Schema, model } from 'mongoose';

/**
 * Interface representing a verification token document in the database.
 * Used for verifying user email addresses during registration or password reset.
 * @interface
 */
export interface IVerificationToken {
  /** The email address this verification token is for */
  email: string;
  /** The verification token string */
  token: string;
  /** Expiration date/time for the token (MongoDB TTL index auto-deletes) */
  expiresAt: Date;
}

/** Mongoose schema for VerificationToken documents with TTL-based auto-expiration */
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

/** Mongoose model for VerificationToken documents */
export default model<IVerificationToken>(
  'VerificationToken',
  verificationTokenSchema,
);
