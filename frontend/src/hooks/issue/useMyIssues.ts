// Node modules
import { useState, useMemo, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// Services
import coreService from '../../services/coreService';

// Lib
import { useUser } from '../../lib/context/UserContext';
import { QUERY_KEYS } from '../../lib/react-query/queryKeys';

// Types
import type { IssueData } from '../../types/issueTypes';

interface UseMyIssuesReturn {
  submittedIssues: IssueData[];
  taggedIssues: IssueData[];
  loading: boolean;
  selectedIssue: IssueData | null;
  setSelectedIssue: (issue: IssueData | null) => void;
  handleIssueUpdated: (updatedIssue: IssueData) => void;
}

export const useMyIssues = (): UseMyIssuesReturn => {
  const { user } = useUser();
  const [selectedIssue, setSelectedIssue] = useState<IssueData | null>(null);
  const queryClient = useQueryClient();

  const { data: myIssues = [], isLoading: loading } = useQuery({
    queryKey: QUERY_KEYS.myIssues,
    queryFn: async () => {
      const res = await coreService.getMyIssues();
      return res.success ? res.data : [];
    },
  });

  const handleIssueUpdated = useCallback(
    (updatedIssue: IssueData) => {
      queryClient.setQueryData(QUERY_KEYS.myIssues, (old: IssueData[] = []) =>
        old.map((issue) =>
          issue._id === updatedIssue._id ? updatedIssue : issue,
        ),
      );

      // Update AllIssues page as well if current user is PaperLeader
      if (user?.role === 'PaperLeader') {
        queryClient.setQueryData(
          QUERY_KEYS.allIssues,
          (old: IssueData[] = []) =>
            old.map((issue) =>
              issue._id === updatedIssue._id ? updatedIssue : issue,
            ),
        );
      }
    },
    [queryClient],
  );

  // Filter issues by submitted or tagged
  const currentUserId = user?._id;

  const submittedIssues = useMemo(
    () => myIssues.filter((issue) => issue.author._id === currentUserId),
    [myIssues, currentUserId],
  );

  const taggedIssues = useMemo(
    () =>
      myIssues.filter((issue) =>
        issue.userTags?.some((tag) => tag._id === currentUserId),
      ),
    [myIssues, currentUserId],
  );

  return {
    submittedIssues,
    taggedIssues,
    loading,
    selectedIssue,
    setSelectedIssue,
    handleIssueUpdated,
  };
};
