// Node modules
import React from 'react';

// MUI
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

// Assets
import authBg from '../../assets/images/auth-bg.webp';
import autLogo from '../../assets/images/aut-logo.jpg';

interface AuthTemplateProps {
  children: React.ReactNode;
}

export default function AuthTemplate({ children }: AuthTemplateProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(230, 81, 0, 0.15)',
          zIndex: -1,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${authBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.9)',
          zIndex: -2,
        },
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: '100%',
          maxWidth: 'md',
          p: 4,
          pb: 2,
          display: 'flex',
          alignItems: 'center',
          borderRadius: 3,
          bgcolor: 'rgba(256, 256, 256, 0.85)',
          height: '450px',
        }}
      >
        <Box
          sx={{
            textAlign: 'center',
            p: 4,
            maxWidth: '400px',
            flex: 1,
          }}
        >
          <img
            src={autLogo}
            alt="AUT Logo"
            style={{
              height: '120px',
              objectFit: 'cover',
            }}
          />
          <Typography
            variant="h5"
            sx={{
              mt: 2,
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            Issue Management & Tracking System
          </Typography>
        </Box>

        <Box sx={{ p: 4, flex: 1, borderLeft: 1, borderColor: 'divider' }}>
          {children}
        </Box>
      </Paper>
    </Box>
  );
}
