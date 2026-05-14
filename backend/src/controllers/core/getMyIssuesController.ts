/**
 * @fileoverview Controller module handling requests to fetch the authenticated
 * user's assigned issues. Retrieves all issues associated with the user's ID.
 */

// Node modules
import type { Request, Response } from 'express';

// Services
import {
  fetchMySubmittedIssues,
  fetchMyTaggedIssues,
} from '../../services/core/getMyIssuesService.js';

/**
 * Handles the request to fetch issues submitted by the authenticated user.
 */
export const getMySubmittedIssues = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({
        message: 'User is not authenticated',
        success: false,
      });
      return;
    }

    const data = await fetchMySubmittedIssues(userId);

    res.status(200).json({
      success: true,
      message: 'Submitted issues fetched successfully',
      data: data,
    });
  } catch (error) {
    console.error('Error fetching submitted issues, ', error);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

/**
 * Handles the request to fetch issues where the authenticated user is tagged.
 */
export const getMyTaggedIssues = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({
        message: 'User is not authenticated',
        success: false,
      });
      return;
    }

    const data = await fetchMyTaggedIssues(userId);

    res.status(200).json({
      success: true,
      message: 'Tagged issues fetched successfully',
      data: data,
    });
  } catch (error) {
    console.error('Error fetching tagged issues, ', error);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};
