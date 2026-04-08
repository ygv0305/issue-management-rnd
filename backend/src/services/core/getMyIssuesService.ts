/**
 * @fileoverview Service module for retrieving issues authored by or assigned
 * to a specific user.
 */

// Models
import Issue from '../../models/issueSchema.js';

// Types
import type { Types } from 'mongoose';

/**
 * Fetches all issues where the given user is either the author or the
 * assignee. Populates related fields (author, type, assignedTo) with
 * relevant user details.
 *
 * @param userId - The MongoDB ObjectId of the user whose issues to fetch.
 * @returns An array of Issue documents with populated references.
 * @async
 */
export const fetchMyIssues = async (userId: string | Types.ObjectId) => {
  return await Issue.find({
    $or: [{ author: userId }, { assignedTo: userId }],
  })
    .populate('author', 'fullName email')
    .populate('type', 'name')
    .populate('assignedTo', 'fullName email')
    .lean()
    .exec();
};
