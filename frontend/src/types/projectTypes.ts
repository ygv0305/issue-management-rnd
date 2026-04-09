/**
 * Project types for API requests and responses.
 * Projects group issues and are managed by Paper Leaders.
 */

// Response
/**
 * Response from fetching all projects.
 * Only available to Paper Leaders and Admins.
 */
export interface GetProjectsResponse {
  success: boolean;
  message: string;
  data: ProjectData[];
}

/**
 * Response from creating a new project.
 */
export interface CreateProjectResponse {
  success: boolean;
  message: string;
  data: ProjectData;
}

// Data models
/**
 * Project record representing a group of related issues.
 * _id is the MongoDB ObjectId.
 */
export interface ProjectData {
  _id: string;
  name: string;
}
