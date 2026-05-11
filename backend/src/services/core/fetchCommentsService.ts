/**
 * @fileoverview Service module for retrieving comments associated with
 * a specific issue.
 */

// Models
import Comment from '../../models/commentSchema.js';

// Node modules
import { Types } from 'mongoose';

/**
 * Fetches all comments for a given issue, sorted by timestamp in ascending
 * order (oldest first). Each comment is populated with the author's email
 * and fullName.
 *
 * @param issueId - The MongoDB ObjectId of the issue whose comments to fetch.
 * @returns An array of Comment documents sorted by timestamp.
 * @async
 */
const fetchCommentsService = async (issueId: string) => {
  const comments = await Comment.find({
    issueId: new Types.ObjectId(issueId),
  })
    .populate('userId', 'email fullName')
    .sort({ timestamp: 1 }); // Sort by timestamp ascending

  return comments;
};

export default fetchCommentsService;
