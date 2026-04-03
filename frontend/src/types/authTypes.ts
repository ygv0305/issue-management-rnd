// Request
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
}

export interface SetPasswordCredentials {
  email: string;
  token: string;
  password: string;
}

export interface WhitelistUserData {
  email: string;
  role: SystemRoles;
  fullName: string;
  projectId?: string;
}

// Response
export interface AuthResponse {
  message: string;
  success: boolean;
  accessToken?: string;
  user?: User;
}

export interface BaseResponse {
  message: string;
  success?: boolean;
}

export interface WhitelistUserResponse {
  success: boolean;
  message: string;
}

// Data models
export type SystemRoles =
  | 'Student'
  | 'Supervisor'
  | 'Moderator'
  | 'PaperLeader'
  | 'Admin'
  | 'Client';

export interface User {
  _id: string;
  email: string;
  role: SystemRoles;
  fullName: string;
  project?: string;
}
