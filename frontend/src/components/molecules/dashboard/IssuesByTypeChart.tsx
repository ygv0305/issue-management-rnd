// MUI
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import { BarChart } from '@mui/x-charts/BarChart';

// Hooks
import { useIssuesByType } from '../../../hooks/dashboard/useIssuesByType';

const IssuesByTypeChart = () => {
  const { data, isLoading, error } = useIssuesByType();

  if (isLoading) {
    return (
      <Paper sx={{ p: 3, borderRadius: 3, height: 400 }}>
        <Skeleton variant="rectangular" height="100%" />
      </Paper>
    );
  }

  if (error || !data) {
    return (
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography color="error">Error loading chart data.</Typography>
      </Paper>
    );
  }

  // Array of labels for x-axis and series data
  const xAxisData = data.map((item) => item.type);
  const countData = data.map((item) => item.count);
  const timeData = data.map((item) =>
    Number(item.averageResolutionTimeHours.toFixed(2)),
  );

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
        Issues Volume vs Resolution by Type
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
        Comparison between volume and resolution efficiency for all issue types
      </Typography>

      <Box sx={{ flexGrow: 1, minHeight: 300 }}>
        <BarChart
          xAxis={[{ scaleType: 'band', data: xAxisData }]}
          yAxis={[
            { id: 'countAxis', label: 'Number of Issues' },
            {
              id: 'timeAxis',
              label: 'Avg. Resolution (Hours)',
              position: 'right',
            },
          ]}
          series={[
            {
              data: countData,
              label: 'Issue Count',
              yAxisId: 'countAxis',
              color: '#1a2027',
            },
            {
              data: timeData,
              label: 'Avg. Resolution',
              yAxisId: 'timeAxis',
              color: '#e65100',
            },
          ]}
          height={320}
          margin={{ top: 20, bottom: 40, left: 40, right: 40 }}
        />
      </Box>
    </Paper>
  );
};

export default IssuesByTypeChart;
