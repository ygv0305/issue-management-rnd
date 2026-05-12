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

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { data, totalCount } = await fetchMySubmittedIssues(
      userId,
      page,
      limit,
    );

    res.status(200).json({
      success: true,
      message: 'Submitted issues fetched successfully',
      data: data,
      pagination: {
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        limit: limit,
      },
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

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { data, totalCount } = await fetchMyTaggedIssues(userId, page, limit);

    res.status(200).json({
      success: true,
      message: 'Tagged issues fetched successfully',
      data: data,
      pagination: {
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        limit: limit,
      },
    });
  } catch (error) {
    console.error('Error fetching tagged issues, ', error);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};
