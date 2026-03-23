// Types
import type { Request, Response } from 'express';
import { Types } from 'mongoose';

// Services
import { setupProfile } from '../../services/setup/setupService.js';

// Node modules
import { body } from 'express-validator';

// Middlewares
import validationError from '../../middlewares/validationError.js';

export interface SetupData {
  userId: Types.ObjectId;
  fullName: string;
  role:
    | 'Student'
    | 'Supervisor'
    | 'Moderator'
    | 'PaperLeader'
    | 'Admin'
    | 'Client';
  projectId?: Types.ObjectId;
}

const projectRules = (data: Pick<SetupData, 'role' | 'projectId'>) => {
  const { role, projectId } = data;

  if (role === 'Student' && !projectId) {
    return 'Student must work in a project';
  }
  return '';
};

export const setupRules = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('role').notEmpty().withMessage('Role is required'),
];

const setupController = async (req: Request, res: Response) => {
  try {
    const { fullName, role, projectId } = req.body;
    const userId = req.userId;

    const checkProject = projectRules({ role, projectId });
    if (checkProject !== '') {
      res.status(400).json({
        success: false,
        message: checkProject,
      });
      return;
    }

    const user = await setupProfile({
      userId,
      fullName,
      role,
      ...(projectId && { projectId }),
    });

    res.status(200).json({ success: true, message: 'Setup complete', user });
  } catch (error: any) {
    console.error('Setup error:', error);
    res.status(500).json({
      code: 'ServerError',
      success: false,
      message: error.message || 'Server error during setup',
    });
  }
};

export default [setupRules, validationError, setupController];
