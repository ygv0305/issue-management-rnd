/**
 * @fileoverview Controller module handling comment retrieval requests.
 * Fetches all comments for a given issue ID provided as a query parameter.
 */

// Types
import type { Request, Response } from 'express';

// Services
import fetchCommentsService from '../../services/core/fetchCommentsService.js';

// Node modules
import { query } from 'express-validator';

// Middlewares
import validationError from '../../middlewares/validationError.js';

/**
 * Validation rules for the fetch comments request query parameters.
 * - `issueId`: Required, must be a valid MongoDB ObjectId.
 */
export const fetchCommentsRules = [
  query('issueId')
    .notEmpty()
    .withMessage('Issue ID is required')
    .isMongoId()
    .withMessage('Issue ID must be a valid MongoDB ID'),
];

/**
 * Handles the request to fetch all comments for a specific issue.
 *
 * @param {Request} req - Express request object containing issueId in the query parameters.
 * @param {Response} res - Express response object used to send back the list of comments.
 * @returns {Promise<void>} A promise that resolves when the response is sent.
 */
const fetchComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { issueId } = req.query;

    if (!issueId || typeof issueId !== 'string') {
      res.status(400).json({
        message: 'Invalid Issue ID',
        success: false,
      });
      return;
    }

    const comments = await fetchCommentsService(issueId);

    res.status(200).json({
      success: true,
      message: 'Comments fetched successfully',
      data: comments,
    });
  } catch (error) {
    console.error('Error fetching comments, ', error);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

/**
 * Middleware pipeline for the fetch comments endpoint.
 * Runs query validation, error handling, and the fetch comments controller.
 */
export default [fetchCommentsRules, validationError, fetchComments];
