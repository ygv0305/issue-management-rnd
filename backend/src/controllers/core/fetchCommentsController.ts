/**
 * @fileoverview Controller module handling comment retrieval requests.
 * Fetches all comments for a given issue ID provided as a query parameter.
 */

// Services
import fetchCommentsService from '../../services/core/fetchCommentsService.js';

// Node modules
import { query } from 'express-validator';
import type { Request, Response } from 'express';

// Middlewares
import validationError from '../../middlewares/validationError.js';

export const fetchCommentsRules = [
  query('issueId')
    .notEmpty()
    .withMessage('Issue ID is required')
    .isMongoId()
    .withMessage('Issue ID must be a valid MongoDB ID'),
];

/**
 * Handles the request to fetch comments for a specific issue with pagination.
 */
const fetchComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { issueId } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!issueId || typeof issueId !== 'string') {
      res.status(400).json({
        message: 'Invalid Issue ID',
        success: false,
      });
      return;
    }

    const { data, totalCount } = await fetchCommentsService(
      issueId,
      page,
      limit,
    );

    res.status(200).json({
      success: true,
      message: 'Comments fetched successfully',
      data: data,
      pagination: {
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        limit: limit,
      },
    });
  } catch (error) {
    console.error('Error fetching comments, ', error);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

export default [fetchCommentsRules, validationError, fetchComments];
