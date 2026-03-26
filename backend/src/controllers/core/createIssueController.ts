// Types
import type { Request, Response } from 'express';

// Services
import { createIssueDb } from '../../services/core/createIssueService.js';

// Node modules
import { body } from 'express-validator';

// Middlewares
import validationError from '../../middlewares/validationError.js';

export const createIssueRules = [
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required')
    .isLength({ max: 50 })
    .withMessage('Subject must be less than 50 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('type')
    .notEmpty()
    .withMessage('Issue type is required')
    .isMongoId()
    .withMessage('Issue type must be a valid MongoDB ID'),
  body('attachments')
    .optional()
    .isArray()
    .withMessage('Attachments must be an array'),
  body('attachments.*.url')
    .if(body('attachments').exists())
    .notEmpty()
    .withMessage('Attachment URL is required')
    .isURL()
    .withMessage('Attachment URL must be valid'),
  body('attachments.*.publicId')
    .if(body('attachments').exists())
    .notEmpty()
    .withMessage('Attachment publicId is required'),
];

const createIssue = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subject, description, type, attachments } = req.body;
    const author = req.userId;

    if (!author) {
      res.status(401).json({
        code: 'Unauthorized',
        message: 'User is not authenticated',
      });
      return;
    }

    const newIssue = await createIssueDb({
      subject,
      description,
      type,
      author,
      attachments: attachments || [],
    });

    res.status(201).json({
      success: true,
      message: 'A new issue has been created successfully',
      data: newIssue,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });
  }
};

export default [createIssueRules, validationError, createIssue];
