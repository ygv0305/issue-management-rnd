// MUI
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';

// Icons
import NotificationsIcon from '@mui/icons-material/Notifications';

// Hooks
import { useTopbar } from '../../../hooks/layout/useTopbar';

// Assets
import autLogo from '../../assets/images/aut-logo.jpg';

const DRAWER_WIDTH = 260;

export default function TopBar() {
  const {
    userName,
    userInitials,
    handleNotificationClick,
    handleProfileClick,
  } = useTopbar();

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
            <Badge badgeContent={0} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

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
