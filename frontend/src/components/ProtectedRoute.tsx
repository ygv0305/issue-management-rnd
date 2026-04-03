// Node modules
import { Navigate, Outlet } from 'react-router';

// Context
import { useUser } from '../lib/context/UserContext';

// Services
import coreService from '../services/coreService';
import pLeaderService from '../services/pLeaderService';

// RBAC
import { hasPermission } from '../lib/rbac/hasPermission';
import { PERMISSIONS } from '../lib/rbac/allPermission';

export default function ProtectedRoute() {
  const { user, loading } = useUser();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const fetchProjectsAndTypes = async () => {
    try {
      const typesRes = await coreService.getIssueTypes();
      if (typesRes.success) {
        const typesStr = JSON.stringify(typesRes.data);
        localStorage.setItem('issueTypes', typesStr);
      }

      if (hasPermission(user, PERMISSIONS.VIEW_PROJECT)) {
        const projectsRes = await pLeaderService.getProjects();
        if (projectsRes.success) {
          const projectsStr = JSON.stringify(projectsRes.data);
          localStorage.setItem('projects', projectsStr);
        }
      }
    } catch (error) {
      console.error('Failed to fetch project data, ', error);
    }
  };
  fetchProjectsAndTypes();

  return <Outlet />;
}
