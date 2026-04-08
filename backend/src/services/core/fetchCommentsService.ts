// Models
import Comment from '../../models/commentSchema.js';

// Types
import { Types } from 'mongoose';

const fetchCommentsService = async (issueId: string) => {
  const comments = await Comment.find({
    issueId: new Types.ObjectId(issueId),
  })
    .populate('userId', 'email fullName')
    .sort({ timestamp: 1 }); // Sort by timestamp ascending

  return comments;
};

export default fetchCommentsService;
