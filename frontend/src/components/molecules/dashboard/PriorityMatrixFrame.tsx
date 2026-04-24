// MUI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';

// Hooks
import { usePriorityMatrix } from '../../../hooks/dashboard/usePriorityMatrix';

// Components
import PriorityCard from '../../atoms/dashboard/PriorityCard';

const levels = ['Low', 'Medium', 'High'] as const;

const PriorityMatrixFrame = () => {
  const { data, isLoading, error } = usePriorityMatrix();

  const getCount = (urgency: string, impact: string) => {
    if (!data) return 0;
    const item = data.find(
      (d) => d._id.urgency === urgency && d._id.impact === impact,
    );
    return item ? item.count : 0;
  };

  if (isLoading) {
    return (
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Skeleton variant="rectangular" height={300} />
      </Paper>
    );
  }

  if (error) {
    return (
      <Typography color="error">Error loading priority matrix.</Typography>
    );
  }

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
        Priority Matrix
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 4 }}>
        Number of Non-Closed issues by Urgency and Impact levels
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, minHeight: 300, px: 3 }}>
        {/* Y-Axis Label (Urgency) */}
        <Box
          sx={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pt: 8,
            color: 'text.secondary',
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            URGENCY
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={1}>
            {/* The Matrix Items */}
            {[...levels].reverse().map((urgency) => (
              <Grid
                container
                key={urgency}
                size={12}
                spacing={1}
                sx={{ alignItems: 'center', textAlign: 'center' }}
              >
                <Grid size={2}>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 700, color: 'text.secondary' }}
                  >
                    {urgency}
                  </Typography>
                </Grid>
                <Grid size={10}>
                  <Grid container spacing={1}>
                    {levels.map((impact) => (
                      <Grid key={impact} size={4}>
                        <PriorityCard
                          urgency={urgency}
                          impact={impact}
                          count={getCount(urgency, impact)}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            ))}

            {/* X-Axis Labels (Impact) */}
            <Grid container size={12}>
              <Grid size={2}></Grid>
              <Grid size={10}>
                <Grid container spacing={1}>
                  {levels.map((impact) => (
                    <Grid key={impact} size={4} sx={{ textAlign: 'center' }}>
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 700, color: 'text.secondary' }}
                      >
                        {impact}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
                <Box
                  sx={{ textAlign: 'center', mt: 2, color: 'text.secondary' }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    IMPACT
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Paper>
  );
};

export default PriorityMatrixFrame;
