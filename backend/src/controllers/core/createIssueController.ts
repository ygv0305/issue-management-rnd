/**
 * @fileoverview Controller module handling issue creation requests.
 * Validates the issue data (subject, description, type, attachments, userTags) and
 * creates a new issue in the database associated with the authenticated user.
 */

// Types
import { IssuePriority } from '../../models/issueSchema.js';

// Services
import {
  createIssueDb,
  validateUserTags,
} from '../../services/core/createIssueService.js';

// Node modules
import { body } from 'express-validator';
import type { Request, Response } from 'express';

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
  body('urgency')
    .notEmpty()
    .withMessage('Urgency level is required')
    .isIn(Object.values(IssuePriority))
    .withMessage('Invalid urgency value'),
  body('impact')
    .notEmpty()
    .withMessage('Impact level is required')
    .isIn(Object.values(IssuePriority))
    .withMessage('Invalid impact value'),
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
  body('userTags')
    .optional()
    .isArray()
    .withMessage('User tags must be an array'),
];

/**
 * Handles the create issue request by extracting data from the request body
 * and the authenticated user's ID, check for valid userTags, then persisting the issue to the database.
 */
const createIssue = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      subject,
      description,
      type,
      urgency,
      impact,
      attachments,
      userTags,
    } = req.body;
    const author = req.userId;

    if (!author) {
      res.status(401).json({
        message: 'User is not authenticated',
        success: false,
      });
      return;
    }

    // Validate if tagged users valid and exist
    if (userTags && userTags.length > 0) {
      const validUsers = await validateUserTags(userTags);

      if (validUsers.length !== userTags.length) {
        res.status(400).json({
          message: 'One or more tagged users are invalid',
          success: false,
        });
        return;
      }
    }

    const newIssue = await createIssueDb({
      subject,
      description,
      type,
      urgency,
      impact,
      author,
      attachments: attachments || [],
      userTags: userTags || [],
    });

    res.status(201).json({
      success: true,
      message: 'A new issue has been created successfully',
      data: newIssue,
    });
  } catch (error) {
    console.error('Error creating new issue, ', error);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

export default [createIssueRules, validationError, createIssue];
