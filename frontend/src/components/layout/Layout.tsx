// Node modules
import { Outlet } from 'react-router';

// Components
import Sidebar from './Sidebar';
import Topbar from './Topbar';

// Styles
import styles from './Layout.module.css';

export default function Layout() {
  return (
    <div className={styles.layoutCont}>
      <Sidebar />
      <div className={styles.contentWrapper}>
        <Topbar />
        <main className={styles.mainContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
