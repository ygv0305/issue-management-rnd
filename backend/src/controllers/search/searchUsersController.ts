/**
 * @fileoverview Controller module handling user search requests.
 * Returns users matching the search query by name or email.
 * @module controllers/search/searchUsersController
 */

// Node modules
import { query } from 'express-validator';

// Types
import type { Request, Response } from 'express';

// Services
import { findMatchingUsers } from '../../services/search/searchUsersService.js';

// Middlewares
import validationError from '../../middlewares/validationError.js';

/**
 * Validation rules for the search users query parameter.
 */
export const searchUsersRules = [
  query('q')
    .optional()
    .isString()
    .withMessage('Query must be a string')
    .isLength({ min: 2 })
    .withMessage('Query must be at least 2 characters'),
];

/**
 * Handles the request to search for users by name or email.
 * Returns an empty array if query is missing or less than 2 characters
 * without hitting the database.
 *
 * @param {Request} req - Express request object containing userId and query param `q`.
 * @param {Response} res - Express response object used to send back the search results.
 * @returns {Promise<void>} A promise that resolves when the response is sent.
 */
const searchUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({
        message: 'User is not authenticated',
        success: false,
      });
      return;
    }

    const q = req.query.q as string | undefined;

    // Return empty array if query is missing or too short
    if (!q || q.length < 2) {
      res.status(200).json({
        success: true,
        message: 'Query too short or missing',
        data: [],
      });
      return;
    }

    const users = await findMatchingUsers(userId, q);

    res.status(200).json({
      success: true,
      message: 'Users found',
      data: users,
    });
  } catch (error) {
    console.error('Error searching users, ', error);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

export default [searchUsersRules, validationError, searchUsers];
