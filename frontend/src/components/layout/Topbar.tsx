// Node modules

// Context
import { useUser } from '../../lib/context/UserContext';

// Assets
import autLogo from '../../assets/images/aut-logo.jpg';

// Styles
import './topbar.css';

export default function Topbar() {
  const { user } = useUser();

  const handleNotificationClick = () => {
    alert('You have 0 new notifications.');
  };

  const handleProfileClick = () => {
    alert(
      `My Profile\n\nName: ${user?.fullName || user?.email}\nRole: ${user?.role}`,
    );
  };

  const getUserInitials = () => {
    if (user?.fullName) {
      return user.fullName.charAt(0).toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <header className="topbar-container">
      <div className="topbar-left">
        <img src={autLogo} alt="AUT Logo" className="topbar-logo" />
      </div>

      <div className="topbar-right">
        <button className="topbar-action-btn" onClick={handleNotificationClick}>
          Notifications
        </button>

        <button className="topbar-action-btn" onClick={handleProfileClick}>
          <div className="topbar-user-info">
            <div className="topbar-user-avatar">{getUserInitials()}</div>
            <span>{user?.fullName || 'Profile'}</span>
          </div>
        </button>
      </div>
    </header>
  );
}
