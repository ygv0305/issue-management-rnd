// MUI
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import { PieChart } from '@mui/x-charts/PieChart';
import { legendClasses } from '@mui/x-charts/ChartsLegend';

// Hooks
import { useIssueTypePercentage } from '../../../hooks/dashboard/useIssueTypePercentage';

const IssueTypePieChart = () => {
  const { data, isLoading, error } = useIssueTypePercentage();

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

  const chartData = data.map((item, index) => ({
    id: index,
    value: item.count,
    label: item.type,
  }));

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
        Issue Distribution by Type
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
        Percentage breakdown of all submitted issues by type
      </Typography>

      <Box sx={{ flexGrow: 1, minHeight: 300, position: 'relative' }}>
        <PieChart
          series={[
            {
              data: chartData,
              highlightScope: { fade: 'global', highlight: 'item' },
              faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
              innerRadius: 30,
              paddingAngle: 5,
              cornerRadius: 5,
            },
          ]}
          height={300}
          slotProps={{
            legend: {
              direction: 'horizontal',
              position: {
                vertical: 'bottom',
                horizontal: 'center',
              },
              sx: {
                pt: 2,
                // CSS-in-JS
                [`.${legendClasses.mark}`]: {
                  height: 16,
                  width: 16,
                },
              },
            },
          }}
        />
      </Box>
    </Paper>
  );
};

export default IssueTypePieChart;
