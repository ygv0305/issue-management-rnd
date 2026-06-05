/**
 * SearchService handles search-related API calls.
 *
 * Methods:
 * - searchUsers(): Search for users by name or email (server-side, debounced)
 *
 * Available to all authenticated users.
 */

// API
import apiAuth from '../lib/api/axiosAuth';

// Types
import type { SearchUsersResponse } from '../types/searchTypes';

class SearchService {
  /**
   * Searches for users whose name or email matches the query.
   * Results are limited to 10 users. Callers should debounce this
   * function to avoid excessive API calls.
   *
   * @param query - The search string (minimum 2 characters).
   * @returns A promise resolving to the search response containing matched users.
   */
  async searchUsers(query: string): Promise<SearchUsersResponse> {
    const response = await apiAuth.get<SearchUsersResponse>(
      `/search/users?q=${encodeURIComponent(query)}`,
    );
    return response.data;
  }
}

export default new SearchService();
