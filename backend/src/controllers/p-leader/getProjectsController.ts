/**
 * @fileoverview Controller module handling requests to fetch all projects.
 * Retrieves every project in the system with their ID and name fields only.
 */

// Types
import type { Request, Response } from 'express';

// Models
import Project from '../../models/projectSchema.js';

/**
 * Handles the request to fetch all projects from the database, returning
 * only the `_id` and `name` fields for lightweight response data.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object used to send back the list of projects.
 * @returns {Promise<void>} A promise that resolves when the response is sent.
 */
const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find({}).select('_id name').lean().exec();

    res.status(200).json({
      success: true,
      message: 'All projects fetched successfully',
      data: projects,
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

export default getProjects;
