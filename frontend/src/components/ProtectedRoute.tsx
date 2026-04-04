// Node modules
import { Navigate, Outlet } from 'react-router';

// Context
import { useUser } from '../lib/context/UserContext';

// Hooks
import { useSyncGlobalData } from '../hooks/useSyncGlobalData';

// RBAC
import { hasPermission } from '../lib/rbac/hasPermission';

interface ProtectedRouteProps {
  requiredPermission?: string;
}

export default function ProtectedRoute({
  requiredPermission,
}: ProtectedRouteProps) {
  const { user, loading } = useUser();

  // Sync global data (projects and issue types)
  useSyncGlobalData();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (requiredPermission && !hasPermission(user, requiredPermission)) {
    // If user is authenticated but not authorized, redirect to /my-issues
    return <Navigate to="/my-issues" replace />;
  }

  return <Outlet />;
}
