/**
 * @fileoverview Service module for retrieving all issues in the system
 * with populated author, type, and assignee details.
 */

// Models
import Issue from '../../models/issueSchema.js';

/**
 * Fetches all issue documents from the database, populating related
 * fields (author, type, assignedTo, userTags) with relevant user details.
 *
 * @returns An array of Issue documents with populated references.
 * @async
 */
export const fetchAllIssues = async () => {
  return await Issue.find({})
    .sort({ createdAt: -1 })
    .populate('author', 'fullName email')
    .populate('type', 'name')
    .populate('assignedTo', 'fullName email')
    .populate('userTags', 'fullName email')
    .lean()
    .exec();
};
