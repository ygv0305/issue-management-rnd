// Models
import Issue from '../../models/issueSchema.js';

export const getIssuesByType = async () => {
  const result = await Issue.aggregate([
    {
      $match: {
        resolvedAt: { $ne: null },
      },
    },
    {
      $lookup: {
        from: 'issuetypes',
        localField: 'type',
        foreignField: '_id',
        as: 'typeData',
      },
    },
    {
      $unwind: '$typeData',
    },
    {
      $group: {
        _id: '$typeData.name',
        count: { $sum: 1 },
        avgTimeMs: {
          $avg: { $subtract: ['$resolvedAt', '$createdAt'] },
        },
      },
    },
  ]);

  return result.map((item) => ({
    type: item._id,
    count: item.count,
    averageResolutionTimeHours: item.avgTimeMs / (1000 * 60 * 60),
  }));
};
