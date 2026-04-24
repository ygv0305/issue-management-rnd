// Types
import type { Request, Response } from 'express';

// Services
import { getTypePercentage } from '../../services/dashboard/issuesByTypeService.js';

const issueTypePercentage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const issueTypePercentage = await getTypePercentage();
    res.status(200).json({
      success: true,
      message: 'Issues type percentage fetched successfully',
      data: issueTypePercentage,
    });
  } catch (error) {
    console.error('Error fetching issues type percentage, ', error);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

export default issueTypePercentage;
