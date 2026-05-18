/**
 * @fileoverview Controller module handling comment creation requests.
 * Validates the comment data (issue ID, message) and creates a new comment
 * associated with the authenticated user.
 */

// Services
import createCommentService from '../../services/core/createCommentService.js';

// Node modules
import { body } from 'express-validator';
import type { Request, Response } from 'express';

// Middlewares
import validationError from '../../middlewares/validationError.js';

export const createCommentRules = [
  body('issueId')
    .notEmpty()
    .withMessage('Issue ID is required')
    .isMongoId()
    .withMessage('Issue ID must be a valid MongoDB ID'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Comment message is required')
    .isLength({ max: 1000 })
    .withMessage('Comment must be less than 1000 characters'),
];

/**
 * Handles the create comment request by extracting the issue ID and message
 * from the request body and the user ID from the authenticated session.
 */
const createComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { issueId, message } = req.body;
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        message: 'User is not authenticated',
        success: false,
      });
      return;
    }

    const newComment = await createCommentService({
      issueId,
      userId,
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: newComment,
    });
  } catch (error) {
    console.error('Error creating comment, ', error);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

export default [createCommentRules, validationError, createComment];
