/**
 * Route guard component that protects routes based on authentication and authorization.
 *
 * Behavior:
 * - If not authenticated: redirects to home (/)
 * - If authenticated but lacks requiredPermission: redirects to /my-issues
 * - If authenticated and authorized: renders the route
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

// MUI
import { Box, CircularProgress, Typography } from '@mui/material';

// Lib
import { useUser } from '../lib/context/UserContext';
import { hasPermission } from '../lib/rbac/hasPermission';

interface ProtectedRouteProps {
  requiredPermission?: string;
}

export default function ProtectedRoute({
  requiredPermission,
}: ProtectedRouteProps) {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
        }}
      >
        <CircularProgress size={48} />
        <Typography variant="body2" color="text.secondary">
          Verifying session...
        </Typography>
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (requiredPermission && !hasPermission(user, requiredPermission)) {
    // If user is authenticated but not authorized, redirect to /my-issues
    return <Navigate to="/my-issues" replace />;
  }

  return <Outlet />;
}
