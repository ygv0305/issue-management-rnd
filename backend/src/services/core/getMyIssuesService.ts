// Models
import Issue from '../../models/issueSchema.js';

// Types
import type { Types } from 'mongoose';

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
