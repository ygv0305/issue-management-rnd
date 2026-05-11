/**
 * @fileoverview Service module for retrieving issues authored by or assigned
 * to or tagged a specific user.
 */

// Models
import Issue from '../../models/issueSchema.js';

// Node modules
import type { Types } from 'mongoose';

/**
 * Fetches all issues where the given user is either the author or being tagged.
 * Populates related fields (author, type, userTags) with relevant user details.
 *
 * @param userId - The MongoDB ObjectId of the user whose issues to fetch.
 * @returns An array of Issue documents with populated references.
 * @async
 */
export const fetchMyIssues = async (userId: string | Types.ObjectId) => {
  return await Issue.find({
    $or: [{ author: userId }, { userTags: userId }],
  })
    .sort({ createdAt: -1 })
    .populate('author', 'fullName email')
    .populate('type', 'name')
    .populate('userTags', 'fullName email')
    .lean()
    .exec();
};
