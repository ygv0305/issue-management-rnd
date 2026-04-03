// Types
import type { User } from './authTypes';

// Request
export interface CreateIssueData {
  subject: string;
  description: string;
  type: string;
  priority: string;
  attachments?: { url: string; publicId: string }[];
}

// Response
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

// Data models
export type IssueStatus =
  | 'New'
  | 'InProgress'
  | 'Resolved'
  | 'ReOpen'
  | 'Closed';

export type IssuePriority = 'Low' | 'Medium' | 'High' | 'Critical';

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
  priority: IssuePriority;
  author: User;
  createdAt: string;
  assignedTo?: User;
}
