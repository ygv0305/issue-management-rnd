// API
import apiAuth from '../lib/api/axiosAuth';

// Types
import type { GetPendingUsersResponse } from '../types/issueTypes';

class AdminService {
  async getPendingUsers(): Promise<GetPendingUsersResponse> {
    const response = await apiAuth.get<GetPendingUsersResponse>(
      '/admin/pending-user',
    );
    return response.data;
  }

  async approveUser(userId: string, status: 'Approved' | 'Rejected'): Promise<any> {
    const response = await apiAuth.post('/admin/approve-user', { userId, status });
    return response.data;
  }
}

export default new AdminService();
