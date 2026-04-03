// Node modules
import { Navigate, Outlet } from 'react-router';

// Context
import { useUser } from '../lib/context/UserContext';

export default function ProtectedRoute() {
  const { user, loading } = useUser();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
