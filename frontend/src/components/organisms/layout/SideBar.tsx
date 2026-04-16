// Node modules
import { NavLink } from 'react-router';

// MUI
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';

// Icons
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircle';
import DatasetIcon from '@mui/icons-material/Dataset';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';

// Context
import { useUser } from '../../../lib/context/UserContext';

// RBAC
import { hasPermission } from '../../../lib/rbac/hasPermission';
import { PERMISSIONS } from '../../../lib/rbac/allPermission';

// Hooks
import { useSidebar } from '../../../hooks/layout/useSidebar';

const DRAWER_WIDTH = 260;

export default function SideBar() {
  const { user } = useUser();
  const { handleLogout } = useSidebar();

  const getActiveStyle = (isActive: boolean) => ({
    color: isActive ? 'primary.main' : 'text.primary',
    bgcolor: isActive ? 'primary.50' : 'transparent',
    borderRight: isActive ? '3px solid' : '3px solid transparent',
    borderColor: isActive ? 'primary.main' : 'transparent',
    '&:hover': {
      bgcolor: isActive ? 'primary.50' : 'action.hover',
    },
  });

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
          Issue Management
        </Typography>
      </Box>

      {/* My Issues */}
      <List sx={{ flexGrow: 1, px: 2 }}>
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            component={NavLink}
            to="/my-issues"
            sx={() => getActiveStyle(window.location.pathname === '/my-issues')}
          >
            <ListItemIcon>
              <AssignmentIndIcon color="inherit" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography sx={{ fontWeight: 500 }}>My Issues</Typography>
              }
            />
          </ListItemButton>
        </ListItem>

        {/* Create Issue */}
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            component={NavLink}
            to="/create-issue"
            sx={() =>
              getActiveStyle(window.location.pathname === '/create-issue')
            }
          >
            <ListItemIcon>
              <AddCircleOutlineIcon color="inherit" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography sx={{ fontWeight: 500 }}>Create Issue</Typography>
              }
            />
          </ListItemButton>
        </ListItem>

        {/* All Issues */}
        {hasPermission(user, PERMISSIONS.VIEW_ALL_ISSUE) && (
          <>
            <Divider />
            <ListItem disablePadding sx={{ my: 0.5 }}>
              <ListItemButton
                component={NavLink}
                to="/all-issues"
                sx={() =>
                  getActiveStyle(window.location.pathname === '/all-issues')
                }
              >
                <ListItemIcon>
                  <AssignmentIcon color="inherit" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ fontWeight: 500 }}>All Issues</Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          </>
        )}

        {/* Dashboard */}
        {hasPermission(user, PERMISSIONS.VIEW_DASHBOARD) && (
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={NavLink}
              to="/dashboard"
              sx={() =>
                getActiveStyle(window.location.pathname === '/dashboard')
              }
            >
              <ListItemIcon>
                <AssignmentIcon color="inherit" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography sx={{ fontWeight: 500 }}>Dashboard</Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        )}

        {/* Project Manage */}
        {hasPermission(user, PERMISSIONS.CREATE_PROJECT) && (
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={NavLink}
              to="/project-manage"
              sx={() =>
                getActiveStyle(window.location.pathname === '/project-manage')
              }
            >
              <ListItemIcon>
                <DatasetIcon color="inherit" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography sx={{ fontWeight: 500 }}>
                    Projects & Types
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        )}

        {/* Account Manage */}
        {hasPermission(user, PERMISSIONS.WHITELIST_USER) && (
          <>
            <Divider />
            <ListItem disablePadding sx={{ my: 0.5 }}>
              <ListItemButton
                component={NavLink}
                to="/account-manage"
                sx={() =>
                  getActiveStyle(window.location.pathname === '/account-manage')
                }
              >
                <ListItemIcon>
                  <PeopleIcon color="inherit" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ fontWeight: 500 }}>Accounts</Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>

      <Divider />

      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          color="secondary"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ justifyContent: 'flex-start', py: 1 }}
        >
          Log Out
        </Button>
      </Box>
    </Drawer>
  );
}
