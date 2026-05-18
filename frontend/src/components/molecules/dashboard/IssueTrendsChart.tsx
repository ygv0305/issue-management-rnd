// MUI
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';
import { useTheme } from '@mui/material/styles';

// Hooks
import { useTrends } from '../../../hooks/dashboard/useTrends';

const IssueTrendsChart = () => {
  const { data, isLoading, error } = useTrends();
  const theme = useTheme();

  if (isLoading) {
    return (
      <Paper sx={{ p: 3, borderRadius: 3, height: 400 }}>
        <Skeleton variant="rectangular" height="100%" />
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography color="error">Error loading chart data.</Typography>
      </Paper>
    );
  }

  if (!data) {
    return (
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
          height: 400,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Issue trends are hidden because the semester is over
        </Typography>
      </Paper>
    );
  }

  const xAxisData = data.map((item) => item.week);
  const submittedData = data.map((item) => item.submitted);
  const resolvedData = data.map((item) => item.resolved);

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
      <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
        Issue Trends
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
        Issues submitted vs resolved per week during the active semester
      </Typography>

      <Box sx={{ flexGrow: 1, minHeight: 300 }}>
        <LineChart
          xAxis={[{ scaleType: 'point', data: xAxisData }]}
          series={[
            {
              data: submittedData,
              label: 'Submitted Issues',
              color: theme.palette.info.main,
            },
            {
              data: resolvedData,
              label: 'Resolved Issues',
              color: theme.palette.success.main,
            },
          ]}
          height={320}
          margin={{ top: 20, bottom: 40, left: 40, right: 40 }}
        />
      </Box>
    </Paper>
  );
};

export default IssueTrendsChart;
