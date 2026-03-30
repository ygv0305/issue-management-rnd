// Node modules
import { Navigate, Outlet, useLocation } from 'react-router';

// Context
import { useUser } from '../lib/context/UserContext';

export default function ProtectedRoute() {
  const { user, loading } = useUser();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const isApproved =
    user.isSetupComplete &&
    (user.approvalStatus === 'Approved' ||
      user.approvalStatus === 'NotRequired');

  // If approved/notrequired account staying on Home, redirect them to dashboard
  if (isApproved && location.pathname === '/home') {
    return <Navigate to="/my-issues" replace />;
  }

  // If pending/rejected account trying to access other pages, redirect them to Home
  if (!isApproved && location.pathname !== '/home') {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}
