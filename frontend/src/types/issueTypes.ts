// Types
import type { User } from './authTypes';

/* Requests */

export interface CreateIssueData {
  subject: string;
  description: string;
  type: string;
  urgency: string;
  impact: string;
  userTags?: string[];
  attachments?: { url: string; publicId: string }[];
}

export interface CreateCommentData {
  issueId: string;
  message: string;
}

export interface ChangeStatusData {
  issueId: string;
  newStatus?: IssueStatus;
  newUrgency?: IssueUrgencyAndImpact;
  newImpact?: IssueUrgencyAndImpact;
}

export interface AssignToMeData {
  issueId: string;
  isUnassign: boolean;
}

export interface PaginationData {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

/* Responses */

export interface GetIssuesResponse {
  message: string;
  success: boolean;
  data: IssueData[];
}

export interface GetIssueTypesResponse {
  success: boolean;
  message: string;
  data: IssueTypeData[];
}

export interface CreateIssueTypeResponse {
  success: boolean;
  message: string;
  data: IssueTypeData;
}

export interface CommentResponse {
  success: boolean;
  message: string;
  data: CommentData;
}

export interface FetchCommentsResponse {
  success: boolean;
  message: string;
  data: CommentData[];
  pagination: PaginationData;
}

export interface ChangeStatusResponse {
  success: boolean;
  message: string;
  data: IssueData;
}

export interface AssignToMeResponse {
  success: boolean;
  message: string;
  data: IssueData;
}

/* Data models */

export type IssueStatus =
  | 'New'
  | 'InProgress'
  | 'Resolved'
  | 'ReOpen'
  | 'Closed';

export type IssuePriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type IssueUrgencyAndImpact = 'Low' | 'Medium' | 'High';

export interface IssueTypeData {
  _id: string;
  name: string;
}

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

export interface CommentData {
  _id: string;
  userId: User;
  message: string;
  timestamp: string;
}
