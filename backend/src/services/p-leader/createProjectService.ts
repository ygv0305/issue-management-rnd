/**
 * @fileoverview Service module for creating new projects in the system.
 */

// Models
import Project from '../../models/projectSchema.js';

/**
 * Checks if a project with the given name already exists in the database.
 *
 * @param name - The project name to look up.
 * @returns The Project document if found, otherwise null.
 * @async
 */
export const checkProjectExist = async (name: string) => {
  return await Project.findOne({ name }).lean().exec();
};

/**
 * Creates a new project document in the database.
 *
 * @param name - The name of the project to create.
 * @returns The newly created Project document.
 * @async
 */
export const createProjectDb = async (name: string) => {
  return await Project.create({ name });
};
