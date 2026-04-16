// RBAC
import { PERMISSIONS } from '../../lib/rbac/allPermission';
import withPermission from '../../lib/rbac/withPermission';

// MUI
import Box from '@mui/material/Box';

function Dashboard() {
  return <Box></Box>;
}

export default withPermission(Dashboard, PERMISSIONS.VIEW_DASHBOARD);
