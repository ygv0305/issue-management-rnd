// Types
import type { Request, Response } from 'express';

// Services
import {
  setupProfile,
  projectRules,
} from '../../services/setup/setupService.js';

// Node modules
import { body } from 'express-validator';

// Middlewares
import validationError from '../../middlewares/validationError.js';

export const setupRules = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('role').notEmpty().withMessage('Role is required'),
];

const setupController = async (req: Request, res: Response) => {
  try {
    const { fullName, role, projectIds } = req.body;
    const userId = req.userId;

    const checkProjects = projectRules({ role, projectIds });
    if (checkProjects !== '') {
      res.status(400).json({
        success: false,
        message: checkProjects,
      });
    }

    const user = await setupProfile({
      userId,
      fullName,
      role,
      projectIds,
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
