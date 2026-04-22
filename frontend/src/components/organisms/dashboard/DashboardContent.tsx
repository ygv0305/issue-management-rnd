// MUI
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// Components
import QuickStatsGroup from '../../molecules/dashboard/QuickStatsGroup';
import PriorityMatrixFrame from '../../molecules/dashboard/PriorityMatrixFrame';
import IssuesByTypeChart from '../../molecules/dashboard/IssuesByTypeChart';

const DashboardContent = () => {
  return (
    <Box sx={{ maxWidth: 1600, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Paper Leader Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Overview of issue management performance and statistics.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Row 1: Quick Stats */}
        <Grid size={12}>
          <QuickStatsGroup />
        </Grid>

        {/* Row 2: Matrix and Chart */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <PriorityMatrixFrame />
        </Grid>
        <Grid size={{ xs: 12, lg: 7 }}>
          <IssuesByTypeChart />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardContent;
