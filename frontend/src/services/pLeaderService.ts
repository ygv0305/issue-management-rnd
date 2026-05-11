/**
 * PLeaderService handles Paper Leader-specific API calls.
 *
 * Paper Leaders have elevated permissions and can:
 * - getAllIssues(): View all issues across the system
 * - getProjects(): Fetch all projects
 * - createProject(): Create a new project
 * - createIssueType(): Define a new issue type
 * - changeStatus(): Change issue status or priority (Admin action)
 * - assignToMe(): Mark an issue as assigned to themselves
 *
 * Restricted to Paper Leader role only.
 */

// API
import apiAuth from '../lib/api/axiosAuth';

// Types
import type {
  GetIssuesResponse,
  CreateIssueTypeResponse,
  ChangeStatusData,
  ChangeStatusResponse,
  AssignToMeData,
  AssignToMeResponse,
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

  async assignToMe(data: AssignToMeData): Promise<AssignToMeResponse> {
    const response = await apiAuth.patch('/p-leader/assign-to-me', data);
    return response.data;
  }
}

export default new PLeaderService();
