// Node modules
import { Outlet } from 'react-router';

// Components
import Sidebar from './Sidebar';
import Topbar from './Topbar';

// Styles
import './layout.css';

export default function Layout() {
  return (
    <div className="layout-container">
      <Sidebar />
      <div className="layout-content-wrapper">
        <Topbar />
        <main className="layout-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
