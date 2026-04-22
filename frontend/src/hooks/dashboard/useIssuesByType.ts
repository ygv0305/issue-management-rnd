// Node modules
import { useQuery } from '@tanstack/react-query';

// Lib
import { QUERY_KEYS } from '../../lib/react-query/queryKeys';

// Services
import { getIssuesByType } from '../../services/dashboardService';

export const useIssuesByType = () => {
  return useQuery({
    queryKey: QUERY_KEYS.dashboard.issuesByType,
    queryFn: getIssuesByType,
  });
};
