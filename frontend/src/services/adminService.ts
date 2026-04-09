/**
 * AdminService handles admin-specific API calls.
 *
 * Methods:
 * - whitelistUser(): Add a user to the system with an assigned role
 *
 * Restricted to Admin role only.
 */

// API
import apiAuth from '../lib/api/axiosAuth';

// Types
import type {
  WhitelistUserData,
  WhitelistUserResponse,
} from '../types/authTypes';

class AdminService {
  async whitelistUser(data: WhitelistUserData): Promise<WhitelistUserResponse> {
    const response = await apiAuth.post<WhitelistUserResponse>(
      '/admin/whitelist-user',
      data,
    );
    return response.data;
  }
}

export default new AdminService();
