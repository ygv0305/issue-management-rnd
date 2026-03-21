// Types
import type { Request, Response } from 'express';

// Models
import User from '../../models/userSchema.js';

const autoLogin = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(401).json({
        code: 'Unauthorized',
        message: 'Invalid login token',
      });
      return;
    }

    res.status(200).json({
      message: 'Login successful',
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });
  }
};

export default autoLogin;
