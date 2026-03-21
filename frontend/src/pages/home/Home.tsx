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

      <div className="home-content">
        <h1>Welcome, {user.fullName || user.email}!</h1>
        <p>You have successfully logged in. This is a protected route.</p>

        <div className="profile-info-card">
          <h3>User Profile Info</h3>
          <p>
            <strong>Role:</strong> {user!.role}
          </p>
          <p>
            <strong>Setup Complete:</strong>{' '}
            {user.isSetupComplete ? 'Yes' : 'No'}
          </p>
          <p>
            <strong>Approval Status:</strong> {user.approvalStatus}
          </p>
        </div>

        <button onClick={handleLogout} className="logout-btn">
          Log Out
        </button>
      </div>
    </div>
  );
}
