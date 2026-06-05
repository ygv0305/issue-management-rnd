// Node modules
import type { Request, Response } from 'express';

// Services
import { getIssuesByType } from '../../services/dashboard/issuesByTypeService.js';

const issuesByType = async (req: Request, res: Response): Promise<void> => {
  try {
    const issuesByType = await getIssuesByType();
    res.status(200).json({
      success: true,
      message: 'Issues by type fetched successfully',
      data: issuesByType,
    });
  } catch (error) {
    console.error('Error fetching issues by type, ', error);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

export default issuesByType;
