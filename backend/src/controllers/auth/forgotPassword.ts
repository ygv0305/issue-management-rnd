// Types
import type { Request, Response } from 'express';
import crypto from 'crypto';

// Models
import User from '../../models/user.js';
import VerificationToken from '../../models/verification-token.js';
import { sendEmail } from '../../utils/email.js';

interface ForgotPasswordData {
  email: string;
}

const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body as ForgotPasswordData;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal that the user doesn't exist for security
      res.status(200).json({ message: 'A password reset link has been sent.' });
      return;
    }

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');

    // Save token
    await VerificationToken.create({
      email,
      token,
      type: 'Reset',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    // Send email
    const resetLink = `http://localhost:5173/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
    await sendEmail(
      email,
      'Reset Your Password - AUT R&D Issue Management',
      `<p>You requested a password reset. Click the link below to set a new password:</p>
       <p><a href="${resetLink}">Reset Password</a></p>
       <p>This link will expire in 24 hours.</p>`,
    );

    res.status(200).json({ message: 'A password reset link has been sent.' });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });
  }
};

export default forgotPassword;
