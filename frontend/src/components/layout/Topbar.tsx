// Hooks
import { useTopbar } from '../../hooks/layout/useTopbar';

// Assets + Styles
import autLogo from '../../assets/images/aut-logo.jpg';
import styles from './Topbar.module.css';

export default function Topbar() {
  const {
    userName,
    userInitials,
    handleNotificationClick,
    handleProfileClick,
  } = useTopbar();

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
            <div className={styles.userAvatar}>{userInitials}</div>
            <span>{userName}</span>
          </div>
        </button>
      </div>
    </header>
  );
}
