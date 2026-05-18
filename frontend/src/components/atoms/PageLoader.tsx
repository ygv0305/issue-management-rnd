// MUI
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

interface PageLoaderProps {
  message?: string;
  minHeight?: string | number;
}

/**
 * A beautiful, premium, and reusable page loader component.
 * Features a dynamic message and customizable centering height.
 */
export default function PageLoader({
  message = 'Loading...',
  minHeight = '50vh',
}: PageLoaderProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight,
        gap: 2.5,
        width: '100%',
      }}
    >
      <CircularProgress
        size={40}
        thickness={4}
        sx={{
          color: 'primary.main',
        }}
      />
      {message && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontWeight: 500,
            letterSpacing: '0.02em',
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
}
