// Node modules
import { useQuery } from '@tanstack/react-query';

// Lib
import { QUERY_KEYS } from '../../lib/react-query/queryKeys';

// Services
import { getPriorityMatrix } from '../../services/dashboardService';

export const usePriorityMatrix = () => {
  return useQuery({
    queryKey: QUERY_KEYS.dashboard.priorityMatrix,
    queryFn: getPriorityMatrix,
  });
};
