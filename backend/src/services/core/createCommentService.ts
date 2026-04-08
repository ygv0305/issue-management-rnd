// Models
import Issue from '../../models/issueSchema.js';
import Comment from '../../models/commentSchema.js';

// Types
import { Types } from 'mongoose';

interface CreateCommentParams {
  issueId: string;
  userId: string | Types.ObjectId;
  message: string;
}

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
