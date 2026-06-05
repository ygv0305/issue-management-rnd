// Models
import Issue from '../../models/issueSchema.js';

// Utils
import { getStartOfWeek, getEndOfWeek } from '../../utils/getDayOfWeek.js';

interface WeekStats {
  avgHours: number;
  count: number;
}

interface AggregationResult {
  thisWeekStats: WeekStats[];
  lastWeekStats: WeekStats[];
  issuesInProgress: Array<{ count: number }>;
  newIssues: Array<{ count: number }>;
}

interface QuickStatsResponse {
  avgResponseTime: number;
  avgResponseTimeChange: number;
  resolved: number;
  resolvedChange: number;
  issuesInProgress: number;
  newIssues: number;
}

export const getQuickStats = async (): Promise<QuickStatsResponse> => {
  const now = new Date();

  // This week: Monday 00:00:00 → current moment
  const thisWeekStart = getStartOfWeek(now);
  const thisWeekEnd = now;

  // Last week: previous Monday 00:00:00 → previous Sunday 23:59:59
  const lastWeekStart = getStartOfWeek(
    new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
  );
  const lastWeekEnd = getEndOfWeek(
    new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
  );

  const aggregation = await Issue.aggregate<AggregationResult>([
    {
      $facet: {
        // Number of resolved issue this week and their's response time
        thisWeekStats: [
          {
            $match: { resolvedAt: { $gte: thisWeekStart, $lte: thisWeekEnd } },
          },
          {
            $addFields: {
              responseTimeMs: { $subtract: ['$resolvedAt', '$createdAt'] },
            },
          },
          {
            $group: {
              _id: null,
              avgMs: { $avg: '$responseTimeMs' },
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              avgHours: { $divide: ['$avgMs', 3600000] },
              count: 1,
              _id: 0,
            },
          },
        ],

        // Number of resolved issue last week and their's response time
        lastWeekStats: [
          {
            $match: { resolvedAt: { $gte: lastWeekStart, $lte: lastWeekEnd } },
          },
          {
            $addFields: {
              responseTimeMs: { $subtract: ['$resolvedAt', '$createdAt'] },
            },
          },
          {
            $group: {
              _id: null,
              avgMs: { $avg: '$responseTimeMs' },
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              avgHours: { $divide: ['$avgMs', 3600000] },
              count: 1,
              _id: 0,
            },
          },
        ],

        // Issues InProgress/ReOpen
        issuesInProgress: [
          { $match: { status: { $in: ['InProgress', 'ReOpen'] } } },
          { $count: 'count' },
        ],

        // New issues
        newIssues: [{ $match: { status: 'New' } }, { $count: 'count' }],
      },
    },
  ]);

  const result = aggregation[0];

  if (result) {
    const thisWeek = result.thisWeekStats[0] ?? { avgHours: 0, count: 0 };
    const lastWeek = result.lastWeekStats[0] ?? { avgHours: 0, count: 0 };

    const avgThisWeek = thisWeek.avgHours;
    const avgLastWeek = lastWeek.avgHours;
    const resolvedThisWeek = thisWeek.count;
    const resolvedLastWeek = lastWeek.count;
    const issuesInProgress = result.issuesInProgress[0]?.count ?? 0;
    const newIssues = result.newIssues[0]?.count ?? 0;

    // Compute percentage change
    const avgChange =
      avgLastWeek === 0 ? 0 : ((avgThisWeek - avgLastWeek) / avgLastWeek) * 100;
    const resolvedChange =
      resolvedLastWeek === 0
        ? 0
        : ((resolvedThisWeek - resolvedLastWeek) / resolvedLastWeek) * 100;

    const roundToTwo = (num: number) => Math.round(num * 100) / 100;

    return {
      avgResponseTime: roundToTwo(avgThisWeek),
      avgResponseTimeChange: roundToTwo(avgChange),
      resolved: resolvedThisWeek,
      resolvedChange: roundToTwo(resolvedChange),
      issuesInProgress,
      newIssues,
    };
  }

  return {
    avgResponseTime: 0,
    avgResponseTimeChange: 0,
    resolved: 0,
    resolvedChange: 0,
    issuesInProgress: 0,
    newIssues: 0,
  };
};
