// Types
import type { Request, Response } from 'express';
import { Types } from 'mongoose';

// Node modules
import { body } from 'express-validator';

// Middlewares
import validationError from '../../middlewares/validationError.js';

// Types
import { SystemRoles } from '../../models/userSchema.js';

// Models
import User from '../../models/userSchema.js';
import Project from '../../models/projectSchema.js';

export interface SetupData {
  fullName: string;
  role: SystemRoles;
  projectId?: Types.ObjectId;
}

const projectRules = (data: Pick<SetupData, 'role' | 'projectId'>) => {
  const { role, projectId } = data;

  if (role === 'Student' && !projectId) {
    return 'Student must work in a project';
  }
  return '';
};

export const setUserRules = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isLength({ max: 50 })
    .withMessage('Email must be less than 50 characters')
    .isEmail()
    .withMessage('Invalid email address')
    // Ensure only domain ends with @autuni.ac.nz
    .custom((value) => {
      if (!value.endsWith('@autuni.ac.nz')) {
        throw new Error('You must register with a valid @autuni.ac.nz address');
      }
      return true;
    }),
  body('role')
    .notEmpty()
    .withMessage('User role is required')
    .isIn(Object.values(SystemRoles)),
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ max: 50 })
    .withMessage('Full name must be less than 50 characters'),
];

const whitelistUser = async (req: Request, res: Response): Promise<void> => {
  const { email, role, fullName, projectId } = req.body;

  try {
    const checkProject = projectRules({ role, projectId });
    if (checkProject !== '') {
      res.status(400).json({
        success: false,
        message: checkProject,
      });
      return;
    }

    const user = User.create({
      email,
      role,
      fullName,
      ...(projectId && { project: projectId }),
    });

    // Update Project.members
    if (projectId) {
      await Project.findByIdAndUpdate(projectId, {
        $addToSet: { members: new Types.ObjectId((await user)._id) },
      });
    }
    res.status(201).json({ success: true, message: 'User whitelisted' });
  } catch (error) {
    console.error('Error white-listing user:', error);
    res.status(500).json({
      code: 'ServerError',
      success: false,
      message: 'Internal server error',
    });
  }
};

export default [setUserRules, validationError, whitelistUser];
