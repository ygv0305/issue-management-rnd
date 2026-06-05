// Lib
import { PERMISSIONS } from '../../lib/rbac/allPermission';
import withPermission from '../../lib/rbac/withPermission';

// Components
import DashboardContent from '../../components/organisms/dashboard/DashboardContent';

function Dashboard() {
  return <DashboardContent />;
}

export default withPermission(Dashboard, PERMISSIONS.VIEW_DASHBOARD);
