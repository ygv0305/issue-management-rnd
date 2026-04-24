// Node modules
import { useQueryClient, useIsFetching } from '@tanstack/react-query';

// MUI
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import RefreshIcon from '@mui/icons-material/Refresh';

// Components
import QuickStatsGroup from '../../molecules/dashboard/QuickStatsGroup';
import PriorityMatrixFrame from '../../molecules/dashboard/PriorityMatrixFrame';
import IssuesByTypeChart from '../../molecules/dashboard/IssuesByTypeChart';
import IssueTypePieChart from '../../molecules/dashboard/TypePercentageChart';

const DashboardContent = () => {
  const queryClient = useQueryClient();
  const isFetching = useIsFetching({ queryKey: ['dashboard'] });

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  };

  return (
    <Box sx={{ maxWidth: 1600, mx: 'auto' }}>
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Paper Leader Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Overview of issue management performance and statistics.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={
            isFetching > 0 ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <RefreshIcon />
            )
          }
          onClick={handleRefresh}
          disabled={isFetching > 0}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            py: 1,
          }}
        >
          {isFetching > 0 ? 'Refreshing...' : 'Refresh'}
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Row 1: Quick Stats */}
        <Grid size={12}>
          <QuickStatsGroup />
        </Grid>

        {/* Row 2: Matrix and Pie Chart */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <PriorityMatrixFrame />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <IssueTypePieChart />
        </Grid>

        {/* Row 3: Bar Chart */}
        <Grid size={12}>
          <IssuesByTypeChart />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardContent;
