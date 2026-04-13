// Node modules
import { Outlet } from 'react-router';

// MUI
import Box from '@mui/material/Box';

// Components
import SideBar from '../organisms/layout/SideBar';
import TopBar from '../organisms/layout/TopBar';

const DRAWER_WIDTH = 260;

export default function LayoutTemplate() {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <TopBar />
      <SideBar />
      <Box
        component="main"
        sx={{
          flex: 1,
          p: 3,
          maxWidth: `calc(100% - ${DRAWER_WIDTH}px)`,
          mt: 8, // margin top to clear the fixed AppBar
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
