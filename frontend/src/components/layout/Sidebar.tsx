// Node modules
import { NavLink } from 'react-router';

// Context
import { useUser } from '../../lib/context/UserContext';

// RBAC
import { hasPermission } from '../../lib/rbac/hasPermission';
import { PERMISSIONS } from '../../lib/rbac/allPermission';

// Hooks
import { useSidebar } from '../../hooks/layout/useSidebar';

// Styles
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const { user } = useUser();
  const { handleLogout } = useSidebar();

  return (
    <aside className={styles.sidebarCont}>
      <div className={styles.sidebarBrand}>Issue Management</div>

      <nav className={styles.sidebarNav}>
        <NavLink
          to="/my-issues"
          className={({ isActive }) =>
            isActive
              ? `${styles.sidebarLink} ${styles.linkActive}`
              : `${styles.sidebarLink}`
          }
        >
          My Issues
        </NavLink>

        {hasPermission(user, PERMISSIONS.VIEW_ALL_ISSUE) && (
          <NavLink
            to="/all-issues"
            className={({ isActive }) =>
              isActive
                ? `${styles.sidebarLink} ${styles.linkActive}`
                : `${styles.sidebarLink}`
            }
          >
            All Issues
          </NavLink>
        )}

        <NavLink
          to="/create-issue"
          className={({ isActive }) =>
            isActive
              ? `${styles.sidebarLink} ${styles.linkActive}`
              : `${styles.sidebarLink}`
          }
        >
          Create Issue
        </NavLink>

        {hasPermission(user, PERMISSIONS.CREATE_PROJECT) && (
          <NavLink
            to="/project-manage"
            className={({ isActive }) =>
              isActive
                ? `${styles.sidebarLink} ${styles.linkActive}`
                : `${styles.sidebarLink}`
            }
          >
            Projects & Types
          </NavLink>
        )}

        {hasPermission(user, PERMISSIONS.WHITELIST_USER) && (
          <NavLink
            to="/account-manage"
            className={({ isActive }) =>
              isActive
                ? `${styles.sidebarLink} ${styles.linkActive}`
                : `${styles.sidebarLink}`
            }
          >
            Accounts
          </NavLink>
        )}
      </nav>

      <div className={styles.sidebarFooter}>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </aside>
  );
}
