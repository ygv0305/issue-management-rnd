// Types
import type { Request, Response } from 'express';
import { IssueStatus, IssuePriority } from '../../models/issueSchema.js';

// Services
import { updateIssueStatus } from '../../services/p-leader/changeStatusService.js';

// Node modules
import { body } from 'express-validator';

// Middlewares
import validationError from '../../middlewares/validationError.js';

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

interface ChangeStatusData {
  issueId: string;
  newStatus?: IssueStatus;
  newPriority?: IssuePriority;
}

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

export default [changeStatusRules, validationError, changeStatus];
