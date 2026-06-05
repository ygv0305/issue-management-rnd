/**
 * Centralized query keys for React Query.
 * Helps avoid magic strings and ensures consistency across the app.
 */
export const QUERY_KEYS = {
  auth: ['auth'],
  user: ['user'],
  issueTypes: ['issueTypes'],
  projects: ['projects'],
  allIssues: ['allIssues'],
  myIssues: {
    mySubmitted: ['myIssues', 'submitted'],
    myTagged: ['myIssues', 'tagged'],
  },
  comments: (issueId: string) => ['comments', issueId],
  dashboard: {
    quickStats: ['dashboard', 'quickStats'],
    priorityMatrix: ['dashboard', 'priorityMatrix'],
    issuesByType: ['dashboard', 'issuesByType'],
    issueTypePercentage: ['dashboard', 'issueTypePercentage'],
    trends: ['dashboard', 'trends'],
  },
  notifications: ['notifications'],
} as const;
