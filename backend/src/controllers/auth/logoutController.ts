/**
 * @fileoverview Controller module handling user logout requests.
 * Revokes the refresh token and clears the HTTP-only cookie to end the session.
 */

// Types
import type { Request, Response } from 'express';

// Services
import { revokeRefreshToken } from '../../services/auth/logoutService.js';

// Config
import config from '../../config/env.js';

/**
 * Handles the logout request by revoking the refresh token from the database
 * and clearing the refreshToken cookie from the client.
 *
 * @param {Request} req - Express request object containing the refreshToken in cookies.
 * @param {Response} res - Express response object used to send back the logout result and clear cookies.
 * @returns {Promise<void>} A promise that resolves when the response is sent.
 */
const logout = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies.refreshToken as string;
  try {
    await revokeRefreshToken(refreshToken);

    const devMode = config.NODE_ENV === 'development';
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: !devMode,
      sameSite: 'lax',
    });

    res.status(200).json({
      message: 'Logout successful',
      success: true,
    });
  } catch (error) {
    console.error('Error logging out, ', error);
    res.status(500).json({
      message: 'Internal server error',
      success: true,
    });
  }
};

export default logout;
