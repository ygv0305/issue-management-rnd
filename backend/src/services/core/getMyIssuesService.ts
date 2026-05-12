/**
 * @fileoverview Service module for retrieving issues authored by or assigned
 * to or tagged a specific user.
 */

// Models
import Issue from '../../models/issueSchema.js';

// Node modules
import type { Types } from 'mongoose';

/**
 * Fetches issues authored by the given user with pagination.
 *
 * @param userId - The MongoDB ObjectId of the user.
 * @param page - Current page number.
 * @param limit - Number of items per page.
 * @returns An object containing paginated submitted issues and the total count.
 * @async
 */
export const fetchMySubmittedIssues = async (
  userId: string | Types.ObjectId,
  page: number,
  limit: number,
) => {
  const skip = (page - 1) * limit;

  const [data, totalCount] = await Promise.all([
    Issue.find({ author: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'fullName email')
      .populate('type', 'name')
      .populate('userTags', 'fullName email')
      .lean()
      .exec(),
    Issue.countDocuments({ author: userId }),
  ]);

  return { data, totalCount };
};

/**
 * Fetches issues where the given user is tagged with pagination.
 *
 * @param userId - The MongoDB ObjectId of the user.
 * @param page - Current page number.
 * @param limit - Number of items per page.
 * @returns An object containing paginated tagged issues and the total count.
 * @async
 */
export const fetchMyTaggedIssues = async (
  userId: string | Types.ObjectId,
  page: number,
  limit: number,
) => {
  const skip = (page - 1) * limit;

  const [data, totalCount] = await Promise.all([
    Issue.find({ userTags: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'fullName email')
      .populate('type', 'name')
      .populate('userTags', 'fullName email')
      .lean()
      .exec(),
    Issue.countDocuments({ userTags: userId }),
  ]);

  return { data, totalCount };
};
