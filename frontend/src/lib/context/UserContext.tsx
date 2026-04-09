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
import React, { createContext, useContext, useState, useEffect } from 'react';

// Services
import authService from '../../services/authService';

// Types
import type { User } from '../../types/authTypes';

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const response = await authService.autoLogin();
        if (response.success && response.user) {
          setUser(response.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auto login failed, ', error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      // Clear all data from localStorage
      localStorage.clear();
      setUser(null);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, checkAuth, logout }}>
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
