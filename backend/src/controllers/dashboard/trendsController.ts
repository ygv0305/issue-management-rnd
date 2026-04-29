// Types
import type { Request, Response } from 'express';

// Services
import { getTrends } from '../../services/dashboard/trendsService.js';

const trends = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await getTrends();
    res.status(200).json({
      success: true,
      message: 'Trends fetched successfully',
      data,
    });
  } catch (error) {
    console.error('Error fetching trends, ', error);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

export default trends;
