/**
 * @fileoverview Service module for retrieving comments associated with
 * a specific issue.
 */

// Models
import Comment from '../../models/commentSchema.js';

// Node modules
import { Types } from 'mongoose';

/**
 * Fetches comments for a given issue with pagination.
 *
 * @param issueId - The MongoDB ObjectId of the issue.
 * @param page - Current page number.
 * @param limit - Number of items per page.
 * @returns An object containing paginated comments and the total count.
 * @async
 */
const fetchCommentsService = async (
  issueId: string,
  page: number,
  limit: number,
) => {
  const skip = (page - 1) * limit;

  const [data, totalCount] = await Promise.all([
    Comment.find({ issueId: new Types.ObjectId(issueId) })
      .populate('userId', 'email fullName')
      .sort({ timestamp: -1 }) // Sort by timestamp descending (newest first for pagination)
      .skip(skip)
      .limit(limit)
      .lean(),
    Comment.countDocuments({ issueId: new Types.ObjectId(issueId) }),
  ]);

  return { data, totalCount };
};

export default fetchCommentsService;
