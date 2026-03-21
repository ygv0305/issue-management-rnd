// Request
export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterCredentials {
  email: string;
}

export interface ForgotPasswordCredentials {
  email: string;
}

export interface SetPasswordCredentials {
  email: string;
  token: string;
  password?: string;
}

export interface SetupProfileData {
  fullName: string;
  role: string;
  projectIds?: string[];
}

// Response
export interface AuthResponse {
  message?: string;
  success?: boolean;
  accessToken?: string;
  user?: User;
}

export interface BaseResponse {
  message: string;
}

export interface GetProjectsResponse {
  success: boolean;
  projects: ProjectData[];
}

// Data models
export interface User {
  _id: string;
  email: string;
  role: 'Student' | 'Supervisor' | 'PaperLeader' | 'Admin' | 'Client';
  fullName?: string;
  project?: string[];
  isSetupComplete: boolean;
  approvalStatus: 'Pending' | 'Approved' | 'Rejected' | 'NotRequired';
}

export interface ProjectData {
  _id: string;
  name: string;
}
