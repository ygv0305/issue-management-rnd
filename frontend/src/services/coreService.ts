// API
import apiAuth from '../lib/api/axiosAuth';

// Types
import type {
  GetIssuesResponse,
  GetIssueTypesResponse,
  CreateIssueData,
} from '../types/issueTypes';

class CoreService {
  async getIssueTypes(): Promise<GetIssueTypesResponse> {
    const response = await apiAuth.get<GetIssueTypesResponse>(
      '/core-base/issue-types',
    );
    return response.data;
  }

  async getMyIssues(): Promise<GetIssuesResponse> {
    const response = await apiAuth.get<GetIssuesResponse>(
      '/core-base/my-issues',
    );
    return response.data;
  }

  async createIssue(data: CreateIssueData): Promise<any> {
    const response = await apiAuth.post('/core-base/create-issue', data);
    return response.data;
  }
}

export default new CoreService();
