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
  myIssues: ['myIssues'],
  comments: (issueId: string) => ['comments', issueId],
} as const;
