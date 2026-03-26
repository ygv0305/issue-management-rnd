import type { User } from './authTypes';

export interface ProjectData {
  _id: string;
  name: string;
}

export interface IssueTypeData {
  _id: string;
  name: string;
}

export interface IssueData {
  _id: string;
  subject: string;
  description: string;
  type: IssueTypeData;
  author: User;
  status: string;
  createdAt: string;
  assignedTo?: User;
}

export interface CreateIssueData {
  subject: string;
  description: string;
  type: string;
  attachments?: { url: string; publicId: string }[];
}

export interface GetIssuesResponse {
  success: boolean;
  data: IssueData[];
}

export interface GetIssueTypesResponse {
  success: boolean;
  data: IssueTypeData[];
}

export interface PendingUser {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
  approvalStatus: string;
}

export interface GetPendingUsersResponse {
  success: boolean;
  data: PendingUser[];
}
