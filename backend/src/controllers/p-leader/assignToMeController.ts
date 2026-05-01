// Node modules
import type { Request, Response } from 'express';
import { body } from 'express-validator';

// Services
import {
  updateIssueAssign,
  removeIssueAssign,
} from '../../services/p-leader/assignToMeService.js';

// Middlewares
import validationError from '../../middlewares/validationError.js';

const assignToMeRules = [
  body('issueId').isMongoId().withMessage('Invalid issue ID'),
  body('isUnassign')
    .notEmpty()
    .withMessage('Unassign check is required')
    .isBoolean()
    .withMessage('Unassign action must be true or false'),
];

const assignToMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const { issueId, isUnassign } = req.body;
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        message: 'User is not authenticated',
        success: false,
      });
      return;
    }

    if (isUnassign) {
      const result = removeIssueAssign({ issueId, userId });

      if (!result) {
        res.status(400).json({
          message: 'Issue has not previously been assigned to you',
          success: false,
        });
        return;
      }

      res.status(200).json({
        message: 'Issue unassigned successfully',
        success: true,
      });
    } else {
      const result = updateIssueAssign({ issueId, userId });

      if (!result) {
        res.status(400).json({
          message: 'Issue has already been assigned to someone else',
          success: false,
        });
        return;
      }

      res.status(200).json({
        message: 'Issue assigned to me successfully',
        success: true,
      });
    }
  } catch (error) {
    console.error('Error assigning issue to me, ', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export default [assignToMeRules, validationError, assignToMe];
