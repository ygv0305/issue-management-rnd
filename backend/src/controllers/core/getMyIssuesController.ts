/**
 * @fileoverview Controller module handling requests to fetch the authenticated
 * user's assigned issues. Retrieves all issues associated with the user's ID.
 */

// Types
import type { Request, Response } from 'express';

// Services
import { fetchMyIssues } from '../../services/core/getMyIssuesService.js';

/**
 * Handles the request to fetch all issues assigned to the authenticated user.
 *
 * @param {Request} req - Express request object containing the userId (attached by auth middleware).
 * @param {Response} res - Express response object used to send back the list of issues.
 * @returns {Promise<void>} A promise that resolves when the response is sent.
 */
const getMyIssues = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({
        message: 'User is not authenticated',
        success: false,
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
    console.error('Error fetching my issues, ', error);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

export default getMyIssues;
