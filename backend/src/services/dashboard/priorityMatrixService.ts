// Models
import Issue, { IssueStatus } from '../../models/issueSchema.js';

export const getPriorityMatrix = async () => {
  return await Issue.aggregate([
    {
      $match: {
        status: { $ne: IssueStatus.Closed },
      },
    },
    {
      $group: {
        _id: { urgency: '$urgency', impact: '$impact' },
        count: { $sum: 1 },
      },
    },
  ]);
};
