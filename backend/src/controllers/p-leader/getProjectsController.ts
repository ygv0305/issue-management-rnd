// Types
import type { Request, Response } from 'express';

// Models
import Project from '../../models/projectSchema.js';

export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find({}).select('_id name').lean().exec();
    res.status(200).json({ success: true, projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      code: 'ServerError',
      success: false,
      message: 'Server error fetching projects',
    });
  }
};
