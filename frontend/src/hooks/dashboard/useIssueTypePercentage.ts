// Node modules
import { useQuery } from '@tanstack/react-query';

// Lib
import { QUERY_KEYS } from '../../lib/react-query/queryKeys';

// Services
import { getIssueTypePercentage } from '../../services/dashboardService';

export const useIssueTypePercentage = () => {
  return useQuery({
    queryKey: QUERY_KEYS.dashboard.issueTypePercentage,
    queryFn: getIssueTypePercentage,
  });
};
