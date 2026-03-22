// Node modules
import crypto from 'crypto';

// Models
import User from '../../models/user.js';
import VerificationToken from '../../models/verificationToken.js';

// Utils
import { sendEmail } from '../../utils/email.js';

export const checkUserExists = async (email: string) => {
  return await User.findOne({ email });
};

export const generateAndSaveToken = async (
  email: string,
  type: 'Register' | 'Reset',
) => {
  const token = crypto.randomBytes(32).toString('hex');

  await VerificationToken.findOneAndUpdate(
    { email, type },
    {
      email,
      token,
      type,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },
    { upsert: true, returnDocument: 'after' },
  );

  return token;
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const createLink = `http://localhost:5173/create-password?token=${token}&email=${encodeURIComponent(email)}`;
  await sendEmail(
    email,
    'Complete Your Registration - AUT R&D Issue Management',
    `<p>Thank you for signing up! Click the link below to set your password and complete your registration:</p>
     <p><a href="${createLink}">Create Password</a></p>
     <p>This link will expire in 24 hours.</p>`,
  );
};
