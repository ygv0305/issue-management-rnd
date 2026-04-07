// API
import apiAuth from '../lib/api/axiosAuth';

// Types
import type {
  GetIssuesResponse,
  CreateIssueTypeResponse,
  ChangeStatusData,
  ChangeStatusResponse,
} from '../types/issueTypes';
import type {
  GetProjectsResponse,
  CreateProjectResponse,
} from '../types/projectTypes';

class PLeaderService {
  async getAllIssues(): Promise<GetIssuesResponse> {
    const response = await apiAuth.get<GetIssuesResponse>(
      '/p-leader/all-issues',
    );
    return response.data;
  }

  async getProjects(): Promise<GetProjectsResponse> {
    const response = await apiAuth.get('/p-leader/projects');
    return response.data;
  }

  async createProject(name: string): Promise<CreateProjectResponse> {
    const response = await apiAuth.post('/p-leader/create-project', { name });
    return response.data;
  }

  async createIssueType(name: string): Promise<CreateIssueTypeResponse> {
    const response = await apiAuth.post('/p-leader/create-issuetype', { name });
    return response.data;
  }

  async changeStatus(data: ChangeStatusData): Promise<ChangeStatusResponse> {
    const response = await apiAuth.patch('/p-leader/change-status', data);
    return response.data;
  }
}

export default new PLeaderService();
