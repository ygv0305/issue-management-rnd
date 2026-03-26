// Models
import Issue from '../../models/issueSchema.js';

export const fetchAllIssues = async () => {
  return await Issue.find({})
    .populate('author', 'fullName email')
    .populate('type', 'name')
    .populate('assignedTo', 'fullName email')
    .lean()
    .exec();
};
