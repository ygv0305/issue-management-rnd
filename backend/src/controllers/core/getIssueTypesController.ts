/**
 * @fileoverview Controller module handling requests to fetch all issue types.
 * Retrieves the complete list of issue types available for categorizing issues.
 */

// Types
import type { Request, Response } from 'express';

// Services
import { fetchAllIssueTypes } from '../../services/core/getIssueTypesService.js';

/**
 * Handles the request to fetch all available issue types from the database.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object used to send back the list of issue types.
 * @returns {Promise<void>} A promise that resolves when the response is sent.
 */
const getIssueTypes = async (req: Request, res: Response): Promise<void> => {
  try {
    const issueTypes = await fetchAllIssueTypes();

    res.status(200).json({
      success: true,
      message: 'Issue types fetched successfully',
      data: issueTypes,
    });
  } catch (error) {
    console.error('Error fetching issue types, ', error);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

export default getIssueTypes;
