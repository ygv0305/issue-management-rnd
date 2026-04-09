/**
 * @fileoverview Service module for creating new issue types in the system.
 */

// Models
import IssueType from '../../models/issueTypeSchema.js';

/**
 * Checks if an issue type with the given name already exists.
 *
 * @param name - The issue type name to look up.
 * @returns The IssueType document if found, otherwise null.
 * @async
 */
export const checkIssueTypeExist = async (name: string) => {
  return await IssueType.findOne({ name }).lean().exec();
};

/**
 * Creates a new issue type document in the database.
 *
 * @param name - The name of the issue type to create.
 * @returns The newly created IssueType document.
 * @async
 */
export const createIssueTypeDb = async (name: string) => {
  return await IssueType.create({ name });
};
