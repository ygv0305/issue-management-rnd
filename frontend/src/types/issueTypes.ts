/**
 * Issue and comment types for API requests and responses.
 * Issues are the core work items in the system, with comments for discussion.
 */

// Types
import type { User } from './authTypes';

// Request
/**
 * Data for creating a new issue.
 */
export interface CreateIssueData {
  subject: string;
  description: string;
  type: string;
  urgency: string;
  impact: string;
  userTags?: string[];
  attachments?: { url: string; publicId: string }[];
}

/**
 * Data for adding a comment to an issue.
 */
export interface CreateCommentData {
  issueId: string;
  message: string;
}

/**
 * Data for changing issue status or priority (Paper Leader action).
 */
export interface ChangeStatusData {
  issueId: string;
  newStatus?: IssueStatus;
  newUrgency?: IssueUrgencyAndImpact;
  newImpact?: IssueUrgencyAndImpact;
}

// Response
/**
 * Response from fetching issues (my issues or all issues).
 */
export interface GetIssuesResponse {
  message: string;
  success: boolean;
  data: IssueData[];
}

/**
 * Response from fetching issue type definitions.
 */
export interface GetIssueTypesResponse {
  success: boolean;
  message: string;
  data: IssueTypeData[];
}

/**
 * Response from creating a new issue type (Paper Leader action).
 */
export interface CreateIssueTypeResponse {
  success: boolean;
  message: string;
  data: IssueTypeData;
}

/**
 * Response from creating a comment.
 */
export interface CommentResponse {
  success: boolean;
  message: string;
  data: CommentData;
}

/**
 * Response from fetching all comments for an issue.
 */
export interface FetchCommentsResponse {
  success: boolean;
  message: string;
  data: CommentData[];
}

/**
 * Response from changing issue status or priority.
 */
export interface ChangeStatusResponse {
  success: boolean;
  message: string;
  data: IssueData;
}

// Data models
/**
 * Issue lifecycle statuses.
 * New → InProgress → Resolved/ReOpen → Closed
 */
export type IssueStatus =
  | 'New'
  | 'InProgress'
  | 'Resolved'
  | 'ReOpen'
  | 'Closed';

/**
 * Issue priority levels used for triage and sorting.
 */
export type IssuePriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type IssueUrgencyAndImpact = 'Low' | 'Medium' | 'High';

/**
 * Issue type definition (e.g., Bug, Feature Request, Documentation).
 * Paper Leaders can create new types.
 */
export interface IssueTypeData {
  _id: string;
  name: string;
}

/**
 * Complete issue record with all metadata.
 * author is always set; assignedTo is optional.
 */
export interface IssueData {
  _id: string;
  subject: string;
  description: string;
  type: IssueTypeData;
  status: IssueStatus;
  urgency: IssueUrgencyAndImpact;
  impact: IssueUrgencyAndImpact;
  author: User;
  createdAt: string;
  assignedTo?: User;
  userTags: User[];
  commentCount: number;
}

/**
 * Comment on an issue with timestamp.
 * userId is the author of the comment.
 */
export interface CommentData {
  _id: string;
  userId: User;
  message: string;
  timestamp: string;
}
