// MUI
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';

// MUI Icons
import NotificationsIcon from '@mui/icons-material/Notifications';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

// Hooks
import { useTopbar } from '../../../hooks/layout/useTopbar';

// Assets
import autLogo from '../../../assets/images/aut-logo.jpg';

const DRAWER_WIDTH = 260;

export default function TopBar() {
  const {
    userName,
    userInitials,
    notifications,
    unreadCount,
    anchorEl,
    handleNotificationClick,
    handleClose,
    handleProfileClick,
    handleMarkAsRead,
    handleMarkAllAsRead,
  } = useTopbar();

  const open = Boolean(anchorEl);

  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        ml: `${DRAWER_WIDTH}px`,
        bgcolor: 'background.paper',
        color: 'text.primary',
        boxShadow: '0px 1px 4px rgba(0,0,0,0.05)',
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <img
            src={autLogo}
            alt="AUT Logo"
            style={{ height: '40px', objectFit: 'contain' }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={handleNotificationClick} color="inherit">
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            slotProps={{
              paper: {
                sx: {
                  width: 360,
                  maxHeight: 500,
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontSize: '1rem', fontWeight: 600 }}
              >
                Notifications
              </Typography>
              {unreadCount > 0 && (
                <Button size="small" onClick={handleMarkAllAsRead}>
                  Mark all as read
                </Button>
              )}
            </Box>
            <Divider />
            <List sx={{ p: 0 }}>
              {notifications.length === 0 ? (
                <MenuItem disabled>
                  <Typography variant="body2">No notifications</Typography>
                </MenuItem>
              ) : (
                notifications.map((notification) => (
                  <ListItemButton
                    key={notification._id}
                    onClick={() => {
                      handleMarkAsRead(notification._id);
                      // TODO: Navigation logic could go here
                      handleClose();
                    }}
                    sx={{
                      bgcolor: notification.isRead
                        ? 'transparent'
                        : 'action.hover',
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      py: 1.5,
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                      {!notification.isRead && (
                        <FiberManualRecordIcon
                          color="primary"
                          sx={{ fontSize: 10, mt: 0.5 }}
                        />
                      )}
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: notification.isRead ? 400 : 600 }}
                        >
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(notification.createdAt).toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  </ListItemButton>
                ))
              )}
            </List>
          </Menu>

          <Box
            component="button"
            onClick={handleProfileClick}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              p: 1,
              borderRadius: 1,
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <Avatar sx={{ bgcolor: 'secondary.main', width: 36, height: 36 }}>
              {userInitials}
            </Avatar>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {userName}
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
