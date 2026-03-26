// Types
import type { Request, Response } from 'express';

// Services
import { updateUserApprovalStatus } from '../../services/admin/approveUserService.js';

// Node modules
import { body } from 'express-validator';

// Middlewares
import validationError from '../../middlewares/validationError.js';

export const approveUserRules = [
  body('userId')
    .trim()
    .notEmpty()
    .withMessage('User ID is required')
    .isMongoId()
    .withMessage('User ID must be a valid MongoDB ID'),
  body('status')
    .trim()
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['Approved', 'Rejected'])
    .withMessage('Status must be either Approved or Rejected'),
];

interface ApproveUserData {
  userId: string;
  status: 'Approved' | 'Rejected';
}

const approveUser = async (req: Request, res: Response): Promise<void> => {
  const { userId, status } = req.body as ApproveUserData;

  try {
    const updatedUser = await updateUserApprovalStatus(userId, status);

    if (!updatedUser) {
      res.status(404).json({
        code: 'UserNotFound',
        message: 'No pending user found with the provided ID',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: `User has been successfully ${status.toLowerCase()}`,
      data: {
        userId: updatedUser._id,
        approvalStatus: updatedUser.approvalStatus,
      },
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });
  }
};

export default [approveUserRules, validationError, approveUser];
