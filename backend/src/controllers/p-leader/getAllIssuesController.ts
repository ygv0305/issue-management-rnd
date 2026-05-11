/**
 * @fileoverview Controller module handling requests to fetch all issues.
 * Retrieves every issue in the system, intended for project leaders and admins.
 */

// Node modules
import type { Request, Response } from 'express';

// Services
import { fetchAllIssues } from '../../services/p-leader/getAllIssuesService.js';

/**
 * Handles the request to fetch all issues from the database.
 */
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
      message: 'Internal server error',
      success: false,
    });
  }
};

export default getAllIssues;
