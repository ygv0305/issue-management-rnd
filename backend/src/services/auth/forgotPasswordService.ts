/**
 * @fileoverview Service module handling the forgot-password flow including
 * user lookup, reset token generation, and sending reset emails.
 */

// Node modules
import crypto from 'crypto';

// Models
import User from '../../models/userSchema.js';
import VerificationToken from '../../models/verificationTokenSchema.js';

// Utils
import { sendEmail } from '../../utils/emailService.js';

/**
 * Finds a user by their email address.
 *
 * @param email - The email address to search for.
 * @returns The user document if found, otherwise null.
 * @async
 */
export const findUserByEmail = async (email: string) => {
  return await User.findOne({ email }).lean().exec();
};

/**
 * Generates a cryptographically secure random token and saves it as a
 * VerificationToken document with a 24-hour expiration.
 *
 * @param email - The email address to associate with the reset token.
 * @returns The generated token string.
 * @async
 */
export const generateAndSaveResetToken = async (email: string) => {
  const token = crypto.randomBytes(32).toString('hex');

  await VerificationToken.create({
    email,
    token,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  });

  return token;
};

/**
 * Sends a password reset email containing a link with the reset token.
 *
 * @param email - The recipient email address.
 * @param token - The reset token to embed in the link.
 * @async
 * @throws May throw if the email service fails to send.
 */
export const sendResetEmail = async (email: string, token: string) => {
  const resetLink = `http://localhost:5173/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
  await sendEmail(
    email,
    'Reset Your Password - AUT R&D Issue Management',
    `<p>You requested a password reset. Click the link below to set a new password:</p>
     <p><a href="${resetLink}">Reset Password</a></p>
     <p>This link will expire in 24 hours.</p>`,
  );
};
