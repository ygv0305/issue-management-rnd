// Node modules
import { useQuery } from '@tanstack/react-query';

// Lib
import { QUERY_KEYS } from '../../lib/react-query/queryKeys';

// Services
import { getQuickStats } from '../../services/dashboardService';

export const useQuickStats = () => {
  return useQuery({
    queryKey: QUERY_KEYS.dashboard.quickStats,
    queryFn: getQuickStats,
  });
};
