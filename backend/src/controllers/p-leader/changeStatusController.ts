/**
 * @fileoverview Controller module handling issue status and priority updates.
 * Validates the issue ID and new status/priority values, then updates
 * the issue record in the database.
 */

// Types
import { IssuePriority } from '../../models/issueSchema.js';

// Services
import { updateIssueStatus } from '../../services/p-leader/changeStatusService.js';

// Node modules
import { body } from 'express-validator';
import type { Request, Response } from 'express';

// Middlewares
import validationError from '../../middlewares/validationError.js';

export enum PLeaderStatusChange {
  InProgress = 'InProgress',
  Resolved = 'Resolved',
  ReOpen = 'ReOpen',
  Closed = 'Closed',
}

export const changeStatusRules = [
  body('issueId').isMongoId().withMessage('Invalid issue ID'),
  body('newStatus')
    .optional()
    .isIn(Object.values(PLeaderStatusChange))
    .withMessage('Invalid status value'),
  body('newUrgency')
    .optional()
    .isIn(Object.values(IssuePriority))
    .withMessage('Invalid urgency value'),
  body('newImpact')
    .optional()
    .isIn(Object.values(IssuePriority))
    .withMessage('Invalid impact value'),
];

interface ChangeStatusData {
  issueId: string;
  newStatus?: PLeaderStatusChange;
  newUrgency?: IssuePriority;
  newImpact?: IssuePriority;
}

/**
 * Handles the request to update an issue's status and/or priority.
 */
const changeStatus = async (req: Request, res: Response): Promise<void> => {
  const { issueId, newStatus, newUrgency, newImpact } =
    req.body as ChangeStatusData;
  const userId = req.userId;

  try {
    const updatedIssue = await updateIssueStatus(
      issueId,
      false,
      userId,
      newStatus,
      newUrgency,
      newImpact,
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

export default [changeStatusRules, validationError, changeStatus];
