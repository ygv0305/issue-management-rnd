// Node modules
import type { Types } from 'mongoose';

// Models
import Issue from '../../models/issueSchema.js';

interface UpdateAssignProps {
  issueId: Types.ObjectId;
  userId: Types.ObjectId;
}

export const updateIssueAssign = async ({
  issueId,
  userId,
}: UpdateAssignProps) => {
  return await Issue.findOneAndUpdate(
    {
      _id: issueId,
      $or: [{ assignedTo: { $exists: false } }, { assignedTo: null }],
    },
    { $set: { assignedTo: userId } },
    { returnDocument: 'after' },
  )
    .populate('author', 'fullName email')
    .populate('type', 'name')
    .populate('assignedTo', 'fullName email')
    .populate('userTags', 'fullName email')
    .lean()
    .exec();
};

export const removeIssueAssign = async ({
  issueId,
  userId,
}: UpdateAssignProps) => {
  return await Issue.findOneAndUpdate(
    {
      _id: issueId,
      assignedTo: userId,
    },
    { $set: { assignedTo: null } },
    { returnDocument: 'after' },
  )
    .populate('author', 'fullName email')
    .populate('type', 'name')
    .populate('assignedTo', 'fullName email')
    .populate('userTags', 'fullName email')
    .lean()
    .exec();
};
