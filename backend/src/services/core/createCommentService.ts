/**
 * @fileoverview Service module for creating comments on issues and updating
 * the associated comment count.
 */

// Models
import Issue from '../../models/issueSchema.js';
import Comment from '../../models/commentSchema.js';

// Types
import { Types } from 'mongoose';

/** Parameters required to create a new comment. */
interface CreateCommentParams {
  /** The MongoDB ObjectId of the issue to comment on. */
  issueId: string;
  /** The MongoDB ObjectId of the user creating the comment. */
  userId: string | Types.ObjectId;
  /** The comment message text. */
  message: string;
}

/**
 * Creates a new comment in the database and increments the associated
 * issue's commentCount. The returned comment is populated with the
 * author's email and fullName.
 *
 * @param params - Object containing issueId, userId, and message.
 * @returns The newly created Comment document with populated userId.
 * @async
 */
const createCommentService = async ({
  issueId,
  userId,
  message,
}: CreateCommentParams) => {
  const newComment = await Comment.create({
    issueId: new Types.ObjectId(issueId),
    userId: new Types.ObjectId(userId),
    message,
    timestamp: new Date(),
  });

  // Increment commentCount in Issue
  await Issue.findByIdAndUpdate(issueId, {
    $inc: { commentCount: 1 },
  });

  return await newComment.populate('userId', 'email fullName');
};

export default createCommentService;
