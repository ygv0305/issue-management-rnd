// Node modules
import { useQuery } from '@tanstack/react-query';

// Services
import coreService from '../services/coreService';
import pLeaderService from '../services/pLeaderService';

// Lib
import { hasPermission } from '../lib/rbac/hasPermission';
import { PERMISSIONS } from '../lib/rbac/allPermission';
import { useUser } from '../lib/context/UserContext';
import { QUERY_KEYS } from '../lib/react-query/queryKeys';

// Types
import type { IssueTypeData } from '../types/issueTypes';
import type { ProjectData } from '../types/projectTypes';

/**
 * Hook to fetch and manage issue types.
 * Synchronizes with localStorage for persistent state across sessions.
 */
export const useIssueTypes = () => {
  return useQuery<IssueTypeData[]>({
    queryKey: QUERY_KEYS.issueTypes,
    queryFn: async () => {
      const res = await coreService.getIssueTypes();
      if (res.success) {
        return res.data;
      }
      throw new Error('Failed to fetch issue types');
    },
    staleTime: Infinity, // Shared data rarely changes
  });
};

/**
 * Hook to fetch and manage projects.
 * Only fetches if the user has VIEW_PROJECT permission.
 */
export const useProjects = () => {
  const { user } = useUser();
  const isAllowed = hasPermission(user, PERMISSIONS.VIEW_PROJECT);

  return useQuery<ProjectData[]>({
    queryKey: QUERY_KEYS.projects,
    queryFn: async () => {
      const res = await pLeaderService.getProjects();
      if (res.success) {
        return res.data;
      }
      throw new Error('Failed to fetch projects');
    },
    enabled: !!user && isAllowed,
    staleTime: Infinity,
  });
};
