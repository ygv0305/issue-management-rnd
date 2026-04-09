/**
 * @fileoverview Controller module handling automatic login requests.
 * Uses the user ID extracted from a valid access token to fetch user
 * details and confirm the session is still active.
 */

// Types
import type { Request, Response } from 'express';

// Models
import User from '../../models/userSchema.js';

/**
 * Handles the auto-login request by looking up the user from the database
 * using the userId attached to the request by authentication middleware.
 *
 * @param {Request} req - Express request object containing the userId (attached by auth middleware).
 * @param {Response} res - Express response object used to send back the user data or error.
 * @returns {Promise<void>} A promise that resolves when the response is sent.
 */
const autoLogin = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId).lean().exec();
    if (!user) {
      res.status(401).json({
        message: 'Invalid login token',
        success: false,
      });
      return;
    }

    res.status(200).json({
      message: 'Login successful',
      success: true,
      user,
    });
  } catch (error) {
    console.error('Error handling auto log in, ', error);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

export default autoLogin;
