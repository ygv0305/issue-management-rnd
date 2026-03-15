// Node modules
import { Navigate, Outlet } from 'react-router';

export default function ProtectedRoute() {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
