// Types
import type { Request, Response } from 'express';

// Services
import { fetchMyIssues } from '../../services/core/getMyIssuesService.js';

const getMyIssues = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        code: 'Unauthorized',
        message: 'User is not authenticated',
      });
      return;
    }

    const myIssues = await fetchMyIssues(userId);

    res.status(200).json({
      success: true,
      message: 'Issues fetched successfully',
      data: myIssues,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });
  }
};

export default [getMyIssues];
