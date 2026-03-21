// API
import apiAuth from '../lib/api/axiosAuth';

// Types
import type {
  AuthResponse,
  GetProjectsResponse,
  SetupProfileData,
} from '../types/authTypes';

class SetupService {
  async getProjects(): Promise<GetProjectsResponse> {
    const response = await apiAuth.get<GetProjectsResponse>('/setup/projects');
    return response.data;
  }

  async setupProfile(data: SetupProfileData): Promise<AuthResponse> {
    const response = await apiAuth.post<AuthResponse>('/setup/submit', data);
    return response.data;
  }
}

export default new SetupService();
