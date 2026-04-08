// Types
import type { Request, Response } from 'express';

// Models
import User from '../../models/userSchema.js';

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
