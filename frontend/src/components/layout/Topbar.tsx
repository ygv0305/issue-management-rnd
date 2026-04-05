// Context
import { useUser } from '../../lib/context/UserContext';

// Assets + Styles
import autLogo from '../../assets/images/aut-logo.jpg';
import styles from './Topbar.module.css';

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
    <header className={styles.topbarCont}>
      <div className={styles.topbarLeft}>
        <img src={autLogo} alt="AUT Logo" className={styles.topbarLogo} />
      </div>

      <div className={styles.topbarRight}>
        <button className={styles.actionBtn} onClick={handleNotificationClick}>
          Notifications
        </button>

        <button className={styles.actionBtn} onClick={handleProfileClick}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>{getUserInitials()}</div>
            <span>{user?.fullName || 'Profile'}</span>
          </div>
        </button>
      </div>
    </header>
  );
}
