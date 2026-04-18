/**
 * @fileoverview Controller module handling project creation requests.
 * Validates the project name, checks for duplicates, and creates a new
 * project in the database.
 */

// Types
import type { Request, Response } from 'express';

// Services
import {
  checkProjectExist,
  createProjectDb,
} from '../../services/p-leader/createProjectService.js';

// Node modules
import { body } from 'express-validator';

// Middlewares
import validationError from '../../middlewares/validationError.js';

/**
 * Validation rules for the create project request body.
 * - `name`: Required, trimmed, max 50 characters.
 */
export const createProjectRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Project name is required')
    .isLength({ max: 50 })
    .withMessage('Project name must be less than 50 characters'),
];

/** Represents the expected shape of the create project request body. */
interface CreateProjectsData {
  name: string;
}

/**
 * Handles the create project request by validating the name uniqueness
 * and persisting the new project to the database.
 *
 * @param {Request} req - Express request object containing the project name in the body.
 * @param {Response} res - Express response object used to send back the created project data.
 * @returns {Promise<void>} A promise that resolves when the response is sent.
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

/**
 * Middleware pipeline for the create project endpoint.
 * Runs body validation, error handling, and the create project controller.
 */
export default [createProjectRules, validationError, createProject];
