/**
 * @fileoverview Controller module handling user whitelisting requests.
 * Allows admins to create user accounts with specific roles and optionally
 * assign them to projects. Validates input and manages project membership.
 */

// Node modules
import type { Request, Response } from 'express';
import { Types } from 'mongoose';
import { body } from 'express-validator';

// Middlewares
import validationError from '../../middlewares/validationError.js';

// Types
import { SystemRoles } from '../../models/userSchema.js';

// Models
import User from '../../models/userSchema.js';
import Project from '../../models/projectSchema.js';

// Utils
import { validateReqEmail } from '../../utils/validateReqEmail.js';

interface SetupData {
  email: string;
  fullName: string;
  role: SystemRoles;
  projectId?: Types.ObjectId;
}

// Validates that a Student role must be assigned to a specific project.
const projectRules = (role: SystemRoles, projectId?: Types.ObjectId) => {
  if (role === 'Student' && !projectId) {
    return 'Student must work in a project';
  }
  return '';
};

export const setUserRules = [
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

/**
 * Handles the request to whitelist a new user by creating their account
 * and optionally adding them to a project's members list.
 */
const whitelistUser = async (req: Request, res: Response): Promise<void> => {
  const { email, role, fullName, projectId }: SetupData = req.body;

  try {
    // Validate that students must be assigned to a project
    const checkProject = projectRules(role, projectId);
    if (checkProject !== '') {
      res.status(400).json({
        message: checkProject,
        success: false,
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
    console.error('Error white-listing user, ', error);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

export default [validateReqEmail, setUserRules, validationError, whitelistUser];
