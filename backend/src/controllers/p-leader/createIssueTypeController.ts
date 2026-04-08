/**
 * @fileoverview Controller module handling issue type creation requests.
 * Validates the issue type name, checks for duplicates, and creates a new
 * issue type in the database.
 */

// Types
import type { Request, Response } from 'express';

// Services
import {
  checkIssueTypeExist,
  createIssueTypeDb,
} from '../../services/p-leader/createIssueTypeService.js';

// Node modules
import { body } from 'express-validator';

// Middlewares
import validationError from '../../middlewares/validationError.js';

/**
 * Validation rules for the create issue type request body.
 * - `name`: Required, trimmed, max 50 characters.
 */
export const createIssueTypeRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Issue type name is required')
    .isLength({ max: 50 })
    .withMessage('Issue type name must be less than 50 characters'),
];

/** Represents the expected shape of the create issue type request body. */
interface CreateIssueTypeData {
  name: string;
}

/**
 * Handles the create issue type request by validating the name uniqueness
 * and persisting the new issue type to the database.
 *
 * @param {Request} req - Express request object containing the issue type name in the body.
 * @param {Response} res - Express response object used to send back the created issue type data.
 * @returns {Promise<void>} A promise that resolves when the response is sent.
 */
const createIssueType = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body as CreateIssueTypeData;

  try {
    const existingType = await checkIssueTypeExist(name);
    if (existingType) {
      res.status(400).json({
        message: 'Issue type with this name already exists',
        success: false,
      });
      return;
    }

    const issueType = await createIssueTypeDb(name);

    res.status(201).json({
      success: true,
      message: 'A new issue type has been created successfully',
      data: issueType,
    });
  } catch (error) {
    console.error('Error creating new issue type, ', error);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

/**
 * Middleware pipeline for the create issue type endpoint.
 * Runs body validation, error handling, and the create issue type controller.
 */
export default [createIssueTypeRules, validationError, createIssueType];
