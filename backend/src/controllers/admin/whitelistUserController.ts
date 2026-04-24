/**
 * @fileoverview Controller module handling user whitelisting requests.
 * Allows admins to create user accounts with specific roles and optionally
 * assign them to projects. Validates input and manages project membership.
 */

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

// Utils
import { validateReqEmail } from '../../utils/validateReqEmail.js';

/** Represents the expected shape of the user setup request body. */
export interface SetupData {
  fullName: string;
  role: SystemRoles;
  projectId?: Types.ObjectId;
}

/**
 * Validates that a Student role must be assigned to a specific project.
 *
 * @param data - Object containing the user's role and optional projectId.
 * @param data.role - The role being assigned to the user.
 * @param data.projectId - The optional project ID the user is assigned to.
 * @returns An error message string if validation fails, or an empty string if valid.
 */
const projectRules = (data: Pick<SetupData, 'role' | 'projectId'>) => {
  const { role, projectId } = data;

  if (role === 'Student' && !projectId) {
    return 'Student must work in a project';
  }
  return '';
};

/**
 * Validation rules for the set user request body.
 * - `role`: Required, must be a valid SystemRoles enum value.
 * - `fullName`: Required, trimmed, max 50 characters.
 */
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
 *
 * @param {Request} req - Express request object containing email, role, fullName, and optional projectId in the body.
 * @param {Response} res - Express response object used to send back the whitelisting result.
 * @returns {Promise<void>} A promise that resolves when the response is sent.
 */
const whitelistUser = async (req: Request, res: Response): Promise<void> => {
  const { email, role, fullName, projectId } = req.body;

  try {
    // Validate that students must be assigned to a project
    const checkProject = projectRules({ role, projectId });
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

/**
 * Middleware pipeline for the whitelist user endpoint.
 * Runs email validation, body validation, error handling, and the whitelist user controller.
 */
export default [validateReqEmail, setUserRules, validationError, whitelistUser];
