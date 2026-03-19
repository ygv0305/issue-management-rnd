// Types
import type { Request, Response } from 'express';

// Models
import RefreshToken from '../../models/refresh-token.js';

// Custom modules
import config from '../../config/env.js';

const logout = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies.refreshToken as string;
  try {
    if (refreshToken) {
      await RefreshToken.deleteOne({ token: refreshToken });
    }

    const devMode = config.NODE_ENV === 'development';
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: !devMode,
      sameSite: 'lax',
    });

    res.status(200).json({
      message: 'Logout successful',
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });
  }
};

export default logout;
