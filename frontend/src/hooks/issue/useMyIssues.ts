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
  submittedLoading: boolean;
  taggedLoading: boolean;
  selectedIssue: IssueData | null;
  setSelectedIssue: (issue: IssueData | null) => void;
  handleIssueUpdated: (updatedIssue: IssueData) => void;
  viewMode: 'submitted' | 'tagged';
  handleViewChange: (
    event: React.MouseEvent<HTMLElement>,
    newView: 'submitted' | 'tagged' | null,
  ) => void;
}

export const useMyIssues = (): UseMyIssuesReturn => {
  const { user } = useUser();
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'submitted' | 'tagged'>('submitted');
  const queryClient = useQueryClient();

  // Fetch only the issues created by the current user
  const { data: submittedIssues = [], isLoading: submittedLoading } = useQuery({
    queryKey: QUERY_KEYS.myIssues.mySubmitted,
    queryFn: async () => {
      const res = await coreService.getMySubmittedIssues();
      return res.success ? res.data : [];
    },
    enabled: !!user?._id,
  });

  // Fetch only the issues where the current user is tagged
  const { data: taggedIssues = [], isLoading: taggedLoading } = useQuery({
    queryKey: QUERY_KEYS.myIssues.myTagged,
    queryFn: async () => {
      const res = await coreService.getMyTaggedIssues();
      return res.success ? res.data : [];
    },
    enabled: !!user?._id,
  });

  // Memoize the selected issue (check both lists)
  const selectedIssue = useMemo(() => {
    return (
      submittedIssues.find((issue) => issue._id === selectedIssueId) ||
      taggedIssues.find((issue) => issue._id === selectedIssueId) ||
      null
    );
  }, [submittedIssues, taggedIssues, selectedIssueId]);

  const setSelectedIssue = useCallback((issue: IssueData | null) => {
    setSelectedIssueId(issue?._id || null);
  }, []);

  const handleIssueUpdated = useCallback(
    (updatedIssue: IssueData) => {
      queryClient.setQueryData(
        QUERY_KEYS.myIssues.mySubmitted,
        (old: IssueData[] = []) =>
          old.map((issue) =>
            issue._id === updatedIssue._id ? updatedIssue : issue,
          ),
      );
      queryClient.setQueryData(
        QUERY_KEYS.myIssues.myTagged,
        (old: IssueData[] = []) =>
          old.map((issue) =>
            issue._id === updatedIssue._id ? updatedIssue : issue,
          ),
      );

      // Update AllIssues page as well if current user is PaperLeader
      if (user?.role === 'PaperLeader' && updatedIssue) {
        queryClient.setQueryData(
          QUERY_KEYS.allIssues,
          (old: IssueData[] = []) =>
            old.map((issue) =>
              issue._id === updatedIssue._id ? updatedIssue : issue,
            ),
        );
      }
    },
    [queryClient, user?.role],
  );

  const handleViewChange = useCallback(
    (
      _event: React.MouseEvent<HTMLElement>,
      newView: 'submitted' | 'tagged' | null,
    ) => {
      if (newView !== null) {
        setViewMode(newView);
      }
    },
    [],
  );

  return {
    submittedIssues,
    taggedIssues,
    submittedLoading,
    taggedLoading,
    selectedIssue,
    setSelectedIssue,
    handleIssueUpdated,
    viewMode,
    handleViewChange,
  };
};
