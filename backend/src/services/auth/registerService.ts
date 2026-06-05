/**
 * @fileoverview Service module handling user registration flow including
 * email verification token generation and sending verification emails.
 */

// Node modules
import crypto from 'crypto';

// Models
import User from '../../models/userSchema.js';
import VerificationToken from '../../models/verificationTokenSchema.js';

// Utils
import { sendEmail } from '../../utils/emailService.js';

// Config
import config from '../../config/env.js';

/**
 * Checks if a user with the given email already exists in the database.
 *
 * @param email - The email address to look up.
 * @returns The user document if found, otherwise null.
 * @async
 */
export const checkUserExist = async (email: string) => {
  return await User.findOne({ email }).lean().exec();
};

/**
 * Generates a cryptographically secure random token and saves it to the
 * VerificationToken collection. If a token already exists for the email,
 * it is updated (upsert).
 *
 * @param email - The email address to associate with the token.
 * @returns The generated token string.
 * @async
 */
export const generateAndSaveToken = async (email: string) => {
  const token = crypto.randomBytes(32).toString('hex');

  await VerificationToken.findOneAndUpdate(
    { email },
    {
      email,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },
    { upsert: true, returnDocument: 'after' },
  );

  return token;
};

/**
 * Sends a verification email with a link for the user to set their password.
 *
 * @param email - The recipient email address.
 * @param token - The verification token to embed in the link.
 * @async
 * @throws May throw if the email service fails to send.
 */
export const sendVerificationEmail = async (email: string, token: string) => {
  const createLink = `${config.FRONTEND_URL}/create-password?token=${token}&email=${encodeURIComponent(email)}`;
  await sendEmail(
    email,
    'Complete Your Registration - AUT R&D Issue Management',
    `<p>Thank you for signing up! Click the link below to set your password and complete your registration:</p>
     <p><a href="${createLink}">Create Password</a></p>
     <p>This link will expire in 24 hours.</p>`,
  );
};
