// Types
import type { Request, Response } from 'express';

// Models
import User from '../../models/user.js';
import VerificationToken from '../../models/verification-token.js';

const setPassword = async (req: Request, res: Response): Promise<void> => {
  const { email, token, password } = req.body;
  try {
    // Check if token exists and is valid
    const verificationToken = await VerificationToken.findOne({ email, token });
    if (!verificationToken) {
      res.status(400).json({
        code: 'InvalidToken',
        message: 'The token is invalid or has expired',
      });
      return;
    }

    if (verificationToken.type === 'Register') {
      // Create the user for the first time
      await User.create({
        email,
        password,
      });
    } else if (verificationToken.type === 'Reset') {
      // User exists, just update their password
      const user = await User.findOne({ email });
      if (!user) {
        res.status(404).json({
          code: 'UserNotFound',
          message: 'User does not exist anymore',
        });
        return;
      }
      user.password = password;
      await user.save();
    }

    // Delete token so it can't be reused
    await VerificationToken.deleteOne({ _id: verificationToken._id });

    res.status(200).json({
      message: 'Password has been set successfully',
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });
  }
};

export default setPassword;
