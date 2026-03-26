// Types
import type { Request, Response } from 'express';

// Services
import { fetchPendingUsers } from '../../services/admin/getPendingUserService.js';

const getPendingUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const pendingUsers = await fetchPendingUsers();

    res.status(200).json({
      success: true,
      message: 'Pending users fetched successfully',
      data: pendingUsers,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });
  }
};

export default [getPendingUsers];
