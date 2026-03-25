// Node modules
import { useNavigate } from 'react-router';

// Types
import type { User } from '../../types/authTypes';

// Components
import SetupModal from '../../components/account-setup/SetupModal';

// Context
import { useUser } from '../../lib/context/UserContext';

// Styles
import './home.css';

export default function Home() {
  const navigate = useNavigate();
  const { user, setUser, logout } = useUser();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSetupComplete = (updatedUser: User) => {
    setUser(updatedUser);
  };

  if (!user) return null;

  return (
    <div className="home-container">
      {user.isSetupComplete === false && (
        <SetupModal onComplete={handleSetupComplete} />
      )}

      {user.isSetupComplete &&
        (user.approvalStatus === 'Pending' ||
          user.approvalStatus === 'Rejected') && (
          <div className="home-content">
            <h1>Account Pending Approval</h1>
            <p>
              Your account status is currently{' '}
              <strong>{user.approvalStatus}</strong>.
            </p>
            <p>
              You must wait for an administrator to approve your account before
              you can access the system.
            </p>

            <button
              onClick={handleLogout}
              className="logout-btn"
              style={{ marginTop: '2rem' }}
            >
              Log Out
            </button>
          </div>
        )}
    </div>
  );
}
