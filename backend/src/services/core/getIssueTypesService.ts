/**
 * @fileoverview Service module for retrieving all issue types from the database.
 */

// Models
import IssueType from '../../models/issueTypeSchema.js';

/**
 * Fetches all issue type documents from the database.
 *
 * @returns An array of IssueType documents.
 * @async
 */
export const fetchAllIssueTypes = async () => {
  return await IssueType.find({}).lean().exec();
};
