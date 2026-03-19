// Types
import type { Request, Response } from 'express';
import crypto from 'crypto';

// Models
import User from '../../models/user.js';
import VerificationToken from '../../models/verification-token.js';
import { sendEmail } from '../../utils/email.js';

interface RegisterData {
  email: string;
}

const register = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body as RegisterData;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        code: 'UserExists',
        message: 'Account with this email already exists',
      });
      return;
    }

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');

    // Save token (upsert to overwrite if they try to register again)
    await VerificationToken.findOneAndUpdate(
      { email, type: 'Register' },
      {
        email,
        token,
        type: 'Register',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
      { upsert: true, returnDocument: 'after' },
    );

    // Send email
    const createLink = `http://localhost:5173/create-password?token=${token}&email=${encodeURIComponent(email)}`;
    await sendEmail(
      email,
      'Complete Your Registration - AUT R&D Issue Management',
      `<p>Thank you for signing up! Click the link below to set your password and complete your registration:</p>
       <p><a href="${createLink}">Create Password</a></p>
       <p>This link will expire in 24 hours.</p>`,
    );

    res.status(200).json({
      message: 'A verification link has been sent to your email address.',
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });
  }
};

export default register;
