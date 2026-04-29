// Node modules
import { useQuery } from '@tanstack/react-query';

// Services
import { getTrends } from '../../services/dashboardService';

// Lib
import { QUERY_KEYS } from '../../lib/react-query/queryKeys';

export const useTrends = () => {
  return useQuery({
    queryKey: QUERY_KEYS.dashboard.trends,
    queryFn: getTrends,
  });
};
