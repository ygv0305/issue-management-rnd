// MUI
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { useQuickStats } from '../../../hooks/dashboard/useQuickStats';

// Components
import QuickStatCard from '../../atoms/dashboard/QuickStatCard';

const QuickStatsGroup = () => {
  const { data, isLoading, error } = useQuickStats();

  if (isLoading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map((i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
            <Skeleton
              variant="rectangular"
              height={140}
              sx={{ borderRadius: 3 }}
            />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (error || !data) {
    return <Typography color="error">Error loading statistics.</Typography>;
  }

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <QuickStatCard
          title="Avg. Resolution Time"
          value={data.avgResponseTime}
          change={data.avgResponseTimeChange}
          suffix="hrs"
          reverseColor={true} // Increase in response time is bad
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <QuickStatCard
          title="Resolved Issues"
          value={data.resolved}
          change={data.resolvedChange}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <QuickStatCard title="In Progress" value={data.issuesInProgress} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <QuickStatCard title="New Issues" value={data.newIssues} />
      </Grid>
    </Grid>
  );
};

export default QuickStatsGroup;
