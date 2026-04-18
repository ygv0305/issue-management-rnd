/**
 * Route guard component that protects routes based on authentication and authorization.
 *
 * Behavior:
 * - If not authenticated: redirects to home (/)
 * - If authenticated but lacks requiredPermission: redirects to /my-issues
 * - If authenticated and authorized: renders the route
 * - Syncs global data (issue types, projects) on mount
 *
 * Use this as a parent route wrapper in the router to protect nested routes.
 * Optionally pass requiredPermission to enforce role-based access control.
 *
 * @example
 * <Route element={<ProtectedRoute requiredPermission={PERMISSIONS.VIEW_ALL_ISSUE} />}>
 *   <Route path="all-issues" element={<AllIssues />} />
 * </Route>
 */

// Node modules
import { Navigate, Outlet } from 'react-router';

// Context
import { useUser } from '../lib/context/UserContext';

// RBAC
import { hasPermission } from '../lib/rbac/hasPermission';

interface ProtectedRouteProps {
  requiredPermission?: string;
}

export default function ProtectedRoute({
  requiredPermission,
}: ProtectedRouteProps) {
  const { user, loading } = useUser();

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
