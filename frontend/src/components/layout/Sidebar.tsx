// Node modules
import { NavLink, useNavigate } from 'react-router';

// Context
import { useUser } from '../../lib/context/UserContext';

// RBAC
import { hasPermission } from '../../lib/rbac/hasPermission';
import { PERMISSIONS } from '../../lib/rbac/allPermission';

// Styles
import './sidebar.css';

export default function Sidebar() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <aside className="sidebar-container">
      <div className="sidebar-brand">Issue Management</div>

      <nav className="sidebar-nav">
        <NavLink
          to="/my-issues"
          className={({ isActive }) =>
            isActive ? 'sidebar-link active' : 'sidebar-link'
          }
        >
          My Issues
        </NavLink>

        {hasPermission(user, PERMISSIONS.VIEW_ALL_ISSUE) && (
          <NavLink
            to="/all-issues"
            className={({ isActive }) =>
              isActive ? 'sidebar-link active' : 'sidebar-link'
            }
          >
            All Issues
          </NavLink>
        )}

        <NavLink
          to="/create-issue"
          className={({ isActive }) =>
            isActive ? 'sidebar-link active' : 'sidebar-link'
          }
        >
          Create Issue
        </NavLink>

        {hasPermission(user, PERMISSIONS.CREATE_PROJECT) && (
          <NavLink
            to="/projects"
            className={({ isActive }) =>
              isActive ? 'sidebar-link active' : 'sidebar-link'
            }
          >
            Projects & Types
          </NavLink>
        )}

        {hasPermission(user, PERMISSIONS.WHITELIST_USER) && (
          <NavLink
            to="/account-manage"
            className={({ isActive }) =>
              isActive ? 'sidebar-link active' : 'sidebar-link'
            }
          >
            Accounts
          </NavLink>
        )}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-logout-btn" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </aside>
  );
}
