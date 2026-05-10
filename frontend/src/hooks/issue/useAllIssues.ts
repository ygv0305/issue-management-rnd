// Node modules
import { useState, useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// Services
import pLeaderService from '../../services/pLeaderService';

// Types
import type { IssueData } from '../../types/issueTypes';

// Lib
import { QUERY_KEYS } from '../../lib/react-query/queryKeys';
import { useUser } from '../../lib/context/UserContext';

interface UseAllIssuesReturn {
  allIssues: IssueData[];
  loading: boolean;
  selectedIssue: IssueData | null;
  setSelectedIssue: (issue: IssueData | null) => void;
  handleIssueUpdated: (updatedIssue: IssueData) => void;
}

export const useAllIssues = (): UseAllIssuesReturn => {
  const queryClient = useQueryClient();
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

  const { user } = useUser();

  const { data: allIssues = [], isLoading: loading } = useQuery({
    queryKey: QUERY_KEYS.allIssues,
    queryFn: async () => {
      const res = await pLeaderService.getAllIssues();
      return res.success ? res.data : [];
    },
  });

  const selectedIssue = useMemo(
    () => allIssues.find((issue) => issue._id === selectedIssueId) || null,
    [allIssues, selectedIssueId],
  );

  const setSelectedIssue = useCallback((issue: IssueData | null) => {
    setSelectedIssueId(issue?._id || null);
  }, []);

  const handleIssueUpdated = useCallback(
    (updatedIssue: IssueData) => {
      queryClient.setQueryData(QUERY_KEYS.allIssues, (old: IssueData[] = []) =>
        old.map((issue) =>
          issue._id === updatedIssue._id ? updatedIssue : issue,
        ),
      );

      // Update MyIssues page as well if current user owns or being tagged in updatedIssue
      if (
        updatedIssue.author._id === user?._id ||
        updatedIssue.userTags.some((u) => u._id === user?._id)
      ) {
        queryClient.setQueryData(QUERY_KEYS.myIssues, (old: IssueData[] = []) =>
          old.map((issue) =>
            issue._id === updatedIssue._id ? updatedIssue : issue,
          ),
        );
      }
    },
    [queryClient, user?._id],
  );

  return {
    allIssues,
    loading,
    selectedIssue,
    setSelectedIssue,
    handleIssueUpdated,
  };
};
