// API
import apiAuth from '../lib/api/axiosAuth';

// Types
import type { GetIssuesResponse } from '../types/issueTypes';

class PLeaderService {
  async getAllIssues(): Promise<GetIssuesResponse> {
    const response = await apiAuth.get<GetIssuesResponse>(
      '/p-leader/all-issues',
    );
    return response.data;
  }

  async getProjects(): Promise<any> {
    const response = await apiAuth.get('/p-leader/projects');
    return response.data;
  }

  async createProject(name: string): Promise<any> {
    const response = await apiAuth.post('/p-leader/create-project', { name });
    return response.data;
  }

  async createIssueType(name: string): Promise<any> {
    const response = await apiAuth.post('/p-leader/create-issuetype', { name });
    return response.data;
  }
}

export default new PLeaderService();
