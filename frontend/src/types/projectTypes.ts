/* Responses */

export interface GetProjectsResponse {
  success: boolean;
  message: string;
  data: ProjectData[];
}

export interface CreateProjectResponse {
  success: boolean;
  message: string;
  data: ProjectData;
}

/* Data models */

export interface ProjectData {
  _id: string;
  name: string;
}
