// Node modules
import type { Request, Response } from 'express';

// Services
import { getPriorityMatrix } from '../../services/dashboard/priorityMatrixService.js';

const priorityMatrix = async (req: Request, res: Response): Promise<void> => {
  try {
    const matrix = await getPriorityMatrix();
    res.status(200).json({
      success: true,
      message: 'Priority matrix fetched successfully',
      data: matrix,
    });
  } catch (error) {
    console.error('Error fetching priority matrix, ', error);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

export default priorityMatrix;
