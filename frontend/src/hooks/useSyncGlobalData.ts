// Node modules
import { useEffect } from 'react';

// Context
import { useUser } from '../lib/context/UserContext';

// Services
import coreService from '../services/coreService';
import pLeaderService from '../services/pLeaderService';

// RBAC
import { hasPermission } from '../lib/rbac/hasPermission';
import { PERMISSIONS } from '../lib/rbac/allPermission';

/**
 * Fetches shared reference data after login and caches it in localStorage.
 *
 * - Issue types: fetched for every authenticated user.
 * - Projects: fetched only for roles with VIEW_PROJECT permission (Admin, PaperLeader).
 *   For other roles the projects key is removed so stale data is never shown.
 *
 * Call this hook once at the top of the app shell (e.g. Layout).
 */
export const useSyncGlobalData = () => {
  const { user, loading } = useUser();

  useEffect(() => {
    if (loading || !user) return;

    const fetchData = async () => {
      try {
        // All users fetch issue types
        const typesRes = await coreService.getIssueTypes();
        if (typesRes.success) {
          localStorage.setItem('issueTypes', JSON.stringify(typesRes.data));
        }

        // Only admin and paper leader fetch projects
        if (hasPermission(user, PERMISSIONS.VIEW_PROJECT)) {
          const projectsRes = await pLeaderService.getProjects();
          if (projectsRes.success) {
            localStorage.setItem('projects', JSON.stringify(projectsRes.data));
          }
        } else {
          // Clear projects from localStorage if user doesn't have permission
          localStorage.removeItem('projects');
        }
      } catch (error) {
        console.error('Failed to sync global data:', error);
      }
    };

    fetchData();
  }, [user, loading]);
};
