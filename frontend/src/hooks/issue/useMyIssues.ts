// Node modules
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

// Services
import coreService from '../../services/coreService';

// Lib
import { useUser } from '../../lib/context/UserContext';
import { PERMISSIONS } from '../../lib/rbac/allPermission';
import { hasPermission } from '../../lib/rbac/hasPermission';
import { QUERY_KEYS } from '../../lib/react-query/queryKeys';

// Types
import type { IssueData } from '../../types/issueTypes';

interface UseMyIssuesReturn {
  submittedIssues: IssueData[];
  assignedIssues: IssueData[];
  taggedIssues: IssueData[];
  loading: boolean;
  selectedIssue: IssueData | null;
  canViewAssigned: boolean;
  setSelectedIssue: (issue: IssueData | null) => void;
}

export const useMyIssues = (): UseMyIssuesReturn => {
  const { user } = useUser();
  const [selectedIssue, setSelectedIssue] = useState<IssueData | null>(null);

  const { data: myIssues = [], isLoading: loading } = useQuery({
    queryKey: QUERY_KEYS.myIssues,
    queryFn: async () => {
      const res = await coreService.getMyIssues();
      return res.success ? res.data : [];
    },
  });

  // Filter issues by submitted, assigned (PaperLeader only), tagged
  const currentUserId = user?._id;

  const submittedIssues = useMemo(
    () => myIssues.filter((issue) => issue.author._id === currentUserId),
    [myIssues, currentUserId],
  );

  const assignedIssues = useMemo(
    () => myIssues.filter((issue) => issue.assignedTo?._id === currentUserId),
    [myIssues, currentUserId],
  );

  const taggedIssues = useMemo(
    () =>
      myIssues.filter((issue) =>
        issue.userTags?.some((tag) => tag._id === currentUserId),
      ),
    [myIssues, currentUserId],
  );

  const canViewAssigned = hasPermission(user, PERMISSIONS.VIEW_ALL_ISSUE);

  return {
    submittedIssues,
    assignedIssues,
    taggedIssues,
    loading,
    selectedIssue,
    canViewAssigned,
    setSelectedIssue,
  };
};
