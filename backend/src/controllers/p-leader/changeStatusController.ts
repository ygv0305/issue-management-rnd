/**
 * @fileoverview Controller module handling issue status and priority updates.
 * Validates the issue ID and new status/priority values, then updates
 * the issue record in the database.
 */

// Types
import type { Request, Response } from 'express';
import { IssueStatus, IssuePriority } from '../../models/issueSchema.js';

// Services
import { updateIssueStatus } from '../../services/p-leader/changeStatusService.js';

// Node modules
import { body } from 'express-validator';

// Middlewares
import validationError from '../../middlewares/validationError.js';

/**
 * Validation rules for the change status request body.
 * - `issueId`: Required, must be a valid MongoDB ObjectId.
 * - `newStatus`: Optional, must be a valid IssueStatus enum value.
 * - `newPriority`: Optional, must be a valid IssuePriority enum value.
 */
export const changeStatusRules = [
  body('issueId').isMongoId().withMessage('Invalid issue ID'),
  body('newStatus')
    .optional()
    .isIn(Object.values(IssueStatus))
    .withMessage('Invalid status value'),
  body('newPriority')
    .optional()
    .isIn(Object.values(IssuePriority))
    .withMessage('Invalid priority value'),
];

/** Represents the expected shape of the change status request body. */
interface ChangeStatusData {
  issueId: string;
  newStatus?: IssueStatus;
  newPriority?: IssuePriority;
}

/**
 * Handles the request to update an issue's status and/or priority.
 *
 * @param {Request} req - Express request object containing issueId, newStatus, and newPriority in the body.
 * @param {Response} res - Express response object used to send back the updated issue data.
 * @returns {Promise<void>} A promise that resolves when the response is sent.
 */
const changeStatus = async (req: Request, res: Response): Promise<void> => {
  const { issueId, newStatus, newPriority } = req.body as ChangeStatusData;

  try {
    const updatedIssue = await updateIssueStatus(
      issueId,
      newStatus,
      newPriority,
    );

    if (!updatedIssue) {
      res.status(404).json({
        success: false,
        message: 'Issue not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Issue updated successfully',
      data: updatedIssue,
    });
  } catch (error) {
    console.error('Error updating issue, ', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * Middleware pipeline for the change status endpoint.
 * Runs body validation, error handling, and the change status controller.
 */
export default [changeStatusRules, validationError, changeStatus];
