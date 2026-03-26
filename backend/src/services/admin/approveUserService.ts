// Models
import User from '../../models/userSchema.js';

// Types
import type { Types } from 'mongoose';

export const updateUserApprovalStatus = async (
  userId: string | Types.ObjectId,
  status: 'Approved' | 'Rejected',
) => {
  return await User.findOneAndUpdate(
    { _id: userId, approvalStatus: 'Pending' },
    { approvalStatus: status },
    { returnDocument: 'after' },
  )
    .lean()
    .exec();
};
