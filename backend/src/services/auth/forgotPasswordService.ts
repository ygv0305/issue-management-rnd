// Node modules
import crypto from 'crypto';

// Models
import User from '../../models/user.js';
import VerificationToken from '../../models/verificationToken.js';

// Utils
import { sendEmail } from '../../utils/email.js';

export const findUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};

export const generateAndSaveResetToken = async (email: string) => {
  const token = crypto.randomBytes(32).toString('hex');

  await VerificationToken.create({
    email,
    token,
    type: 'Reset',
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  });

  return token;
};

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
