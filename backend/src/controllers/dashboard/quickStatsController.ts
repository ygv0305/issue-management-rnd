// Node modules
import type { Request, Response } from 'express';

// Services
import { getQuickStats } from '../../services/dashboard/quickStatsService.js';

const quickStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await getQuickStats();
    res.status(200).json({
      success: true,
      message: 'Quick stats fetched successfully',
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching quick stats, ', error);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

export default quickStats;
