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
