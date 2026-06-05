export interface QuickStatsResponse {
  avgResponseTime: number;
  avgResponseTimeChange: number;
  resolved: number;
  resolvedChange: number;
  issuesInProgress: number;
  newIssues: number;
}

export interface PriorityMatrixItem {
  _id: {
    urgency: 'Low' | 'Medium' | 'High';
    impact: 'Low' | 'Medium' | 'High';
  };
  count: number;
}

export interface IssuesByTypeItem {
  type: string;
  count: number;
  averageResolutionTimeHours: number;
}

export interface IssueTypePercentageItem {
  type: string;
  count: number;
}

export interface TrendItem {
  week: string;
  submitted: number;
  resolved: number;
}
