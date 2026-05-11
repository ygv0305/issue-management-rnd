// Node modules
import type { Request, Response } from 'express';
import { body } from 'express-validator';

// Services
import { updateIssueStatus } from '../../services/p-leader/changeStatusService.js';

// Middlewares
import validationError from '../../middlewares/validationError.js';

// Types
import { PLeaderStatusChange } from '../p-leader/changeStatusController.js';

export const reopenIssueRules = [
  body('issueId').isMongoId().withMessage('Invalid issue ID'),
];

const reopenIssue = async (req: Request, res: Response): Promise<void> => {
  const { issueId } = req.body;
  const userId = req.userId;
  const newStatus = PLeaderStatusChange.ReOpen;

  try {
    const updatedIssue = await updateIssueStatus(
      issueId,
      true,
      userId,
      newStatus,
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
      message: 'Issue re-opened successfully',
      data: updatedIssue,
    });
  } catch (error) {
    console.error('Error re-opening issue, ', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export default [reopenIssueRules, validationError, reopenIssue];
