/**
 * UserContext manages the authenticated user's state and session across the app.
 *
 * Provides:
 * - user: Current authenticated user or null
 * - loading: Whether auth state is being initialized
 * - checkAuth(): Validate stored access token and restore user session
 * - logout(): Clear user data and revoke session
 *
 * Wrap the app with `UserProvider` to make this context available.
 * Access user data with the `useUser()` hook.
 */

// Node modules
import React, { createContext, useContext } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// Services
import authService from '../../services/authService';

// Types
import type { User } from '../../types/authTypes';

// Lib
import { QUERY_KEYS } from '../react-query/queryKeys';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void; // Wrapped to update query cache
  loading: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  // Use query to manage user state
  const {
    data: user,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.auth,
    queryFn: async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return null;
      try {
        const response = await authService.autoLogin();
        return response.success && response.user ? response.user : null;
      } catch (error) {
        console.error('Auto login failed, ', error);
        return null;
      }
    },
    staleTime: Infinity, // Keep auth state until manually invalidated
  });

  const checkAuth = async () => {
    await refetch();
  };

  const setUser = (newUser: User | null) => {
    queryClient.setQueryData(QUERY_KEYS.auth, newUser);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error, ', error);
    } finally {
      // Clear cache and localStorage
      localStorage.clear();
      queryClient.setQueryData(QUERY_KEYS.auth, null);
      queryClient.clear(); // Clear all other queries too on logout
    }
  };

  return (
    <UserContext.Provider
      value={{
        user: user ?? null,
        setUser,
        loading,
        checkAuth,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
