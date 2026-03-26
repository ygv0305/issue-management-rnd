// Models
import User from '../../models/userSchema.js';

export const fetchPendingUsers = async () => {
  return await User.find({ approvalStatus: 'Pending' })
    .select('fullName email role approvalStatus createdAt')
    .lean()
    .exec();
};
