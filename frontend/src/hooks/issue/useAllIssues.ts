// Node modules
import { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// Services
import pLeaderService from '../../services/pLeaderService';

// Types
import type { IssueData } from '../../types/issueTypes';

// React Query
import { QUERY_KEYS } from '../../lib/react-query/queryKeys';

interface UseAllIssuesReturn {
  allIssues: IssueData[];
  loading: boolean;
  selectedIssue: IssueData | null;
  setSelectedIssue: (issue: IssueData | null) => void;
  handleIssueUpdated: (updatedIssue: IssueData) => void;
}

export const useAllIssues = (): UseAllIssuesReturn => {
  const queryClient = useQueryClient();
  const [selectedIssue, setSelectedIssue] = useState<IssueData | null>(null);

  const { data: allIssues = [], isLoading: loading } = useQuery({
    queryKey: QUERY_KEYS.allIssues,
    queryFn: async () => {
      const res = await pLeaderService.getAllIssues();
      return res.success ? res.data : [];
    },
  });

  const handleIssueUpdated = useCallback(
    (updatedIssue: IssueData) => {
      queryClient.setQueryData(QUERY_KEYS.allIssues, (old: IssueData[] = []) =>
        old.map((issue) =>
          issue._id === updatedIssue._id ? updatedIssue : issue,
        ),
      );
    },
    [queryClient],
  );

  return {
    allIssues,
    loading,
    selectedIssue,
    setSelectedIssue,
    handleIssueUpdated,
  };
};
