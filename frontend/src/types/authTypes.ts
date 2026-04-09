/**
 * Authentication types for API requests and responses.
 */

// Request
/**
 * Credentials for user login.
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Data for user registration (email only).
 */
export interface RegisterCredentials {
  email: string;
}

/**
 * Data for setting a new password via email link.
 */
export interface SetPasswordCredentials {
  email: string;
  token: string;
  password: string;
}

/**
 * Data for admins to add a user to the system with a role assignment.
 */
export interface WhitelistUserData {
  email: string;
  role: SystemRoles;
  fullName: string;
  projectId?: string;
}

// Response
/**
 * Response from login, registration, or auto-login endpoints.
 * Returns access token and user profile on success.
 */
export interface AuthResponse {
  message: string;
  success: boolean;
  accessToken?: string;
  user?: User;
}

/**
 * Generic response for endpoints that don't return data.
 */
export interface BaseResponse {
  message: string;
  success?: boolean;
}

/**
 * Response from whitelist user operation.
 */
export interface WhitelistUserResponse {
  success: boolean;
  message: string;
}

// Data models
/**
 * System roles define authorization levels across the app.
 * - Student: Basic user, can create and view own issues
 * - Supervisor: Manages student work (currently same as Student)
 * - Moderator: Content moderator (currently same as Student)
 * - PaperLeader: Project lead, can view all issues and manage projects
 * - Admin: System administrator, manages users and system settings
 * - Client: External stakeholder (currently same as Student)
 */
export type SystemRoles =
  | 'Student'
  | 'Supervisor'
  | 'Moderator'
  | 'PaperLeader'
  | 'Admin'
  | 'Client';

/**
 * Authenticated user profile.
 * _id is the MongoDB ObjectId.
 * project is the assigned project ID for role-specific operations.
 */
export interface User {
  _id: string;
  email: string;
  role: SystemRoles;
  fullName: string;
  project?: string;
}
