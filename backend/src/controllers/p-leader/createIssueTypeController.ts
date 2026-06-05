/**
 * @fileoverview Controller module handling issue type creation requests.
 * Validates the issue type name, checks for duplicates, and creates a new
 * issue type in the database.
 */

// Services
import {
  checkIssueTypeExist,
  createIssueTypeDb,
} from '../../services/p-leader/createIssueTypeService.js';

// Node modules
import { body } from 'express-validator';
import type { Request, Response } from 'express';

// Middlewares
import validationError from '../../middlewares/validationError.js';

export const createIssueTypeRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Issue type name is required')
    .isLength({ max: 50 })
    .withMessage('Issue type name must be less than 50 characters'),
];

interface CreateIssueTypeData {
  name: string;
}

/**
 * Handles the create issue type request by validating the name uniqueness
 * and persisting the new issue type to the database.
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

export default [createIssueTypeRules, validationError, createIssueType];
