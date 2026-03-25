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
      <div className="sidebar-brand">IMS</div>

      <nav className="sidebar-nav">
        <NavLink
          to="/issues"
          className={({ isActive }) =>
            isActive ? 'sidebar-link active' : 'sidebar-link'
          }
        >
          Issues
        </NavLink>

        <NavLink
          to="/create-issue"
          className={({ isActive }) =>
            isActive ? 'sidebar-link active' : 'sidebar-link'
          }
        >
          Create Issue
        </NavLink>

        {hasPermission(user, PERMISSIONS.VIEW_PROJECT) && (
          <NavLink
            to="/projects"
            className={({ isActive }) =>
              isActive ? 'sidebar-link active' : 'sidebar-link'
            }
          >
            Projects
          </NavLink>
        )}

        {hasPermission(user, PERMISSIONS.APPROVE_USER) && (
          <NavLink
            to="/accounts"
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
