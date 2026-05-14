/**
 * @fileoverview Service module for retrieving issues authored by or assigned
 * to or tagged a specific user.
 */

// Models
import Issue from '../../models/issueSchema.js';

// Node modules
import type { Types } from 'mongoose';

/**
 * Fetches issues authored by the given user.
 *
 * @param userId - The MongoDB ObjectId of the user.
 * @returns An array of Issue documents with populated references.
 * @async
 */
export const fetchMySubmittedIssues = async (
  userId: string | Types.ObjectId,
) => {
  return await Issue.find({ author: userId })
    .sort({ createdAt: -1 })
    .populate('author', 'fullName email')
    .populate('type', 'name')
    .populate('userTags', 'fullName email')
    .lean()
    .exec();
};

/**
 * Fetches issues where the given user is tagged.
 *
 * @param userId - The MongoDB ObjectId of the user.
 * @returns An array of Issue documents with populated references.
 * @async
 */
export const fetchMyTaggedIssues = async (userId: string | Types.ObjectId) => {
  return await Issue.find({ userTags: userId })
    .sort({ createdAt: -1 })
    .populate('author', 'fullName email')
    .populate('type', 'name')
    .populate('userTags', 'fullName email')
    .lean()
    .exec();
};
