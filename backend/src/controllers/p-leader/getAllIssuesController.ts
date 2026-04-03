// Types
import type { Request, Response } from 'express';

// Services
import { fetchAllIssues } from '../../services/p-leader/getAllIssuesService.js';

const getAllIssues = async (req: Request, res: Response): Promise<void> => {
  try {
    const allIssues = await fetchAllIssues();

    res.status(200).json({
      success: true,
      message: 'All issues fetched successfully',
      data: allIssues,
    });
  } catch (error) {
    console.error('Error fetching all issues, ', error);
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      success: false,
    });
  }
};

export default getAllIssues;
