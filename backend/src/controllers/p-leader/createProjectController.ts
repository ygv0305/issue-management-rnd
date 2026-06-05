/**
 * @fileoverview Controller module handling project creation requests.
 * Validates the project name, checks for duplicates, and creates a new
 * project in the database.
 */

// Services
import {
  checkProjectExist,
  createProjectDb,
} from '../../services/p-leader/createProjectService.js';

// Node modules
import { body } from 'express-validator';
import type { Request, Response } from 'express';

// Middlewares
import validationError from '../../middlewares/validationError.js';

export const createProjectRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Project name is required')
    .isLength({ max: 50 })
    .withMessage('Project name must be less than 50 characters'),
];

interface CreateProjectsData {
  name: string;
}

/**
 * Handles the create project request by validating the name uniqueness
 * and persisting the new project to the database.
 */
const createProject = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body as CreateProjectsData;

  try {
    // Check if project exists
    const existingProject = await checkProjectExist(name);
    if (existingProject) {
      res.status(400).json({
        message: 'Project with this name already exists',
        success: false,
      });
      return;
    }

    const project = await createProjectDb(name);

    res.status(201).json({
      success: true,
      message: 'A new project has been created successfully',
      data: project,
    });
  } catch (error) {
    console.error('Error creating new project, ', error);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

export default [createProjectRules, validationError, createProject];
