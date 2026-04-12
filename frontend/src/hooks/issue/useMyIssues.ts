// Node modules
import { useEffect, useState, useMemo } from 'react';

// Services
import coreService from '../../services/coreService';

// Context
import { useUser } from '../../lib/context/UserContext';

// RBAC
import { PERMISSIONS } from '../../lib/rbac/allPermission';
import { hasPermission } from '../../lib/rbac/hasPermission';

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
  const [myIssues, setMyIssues] = useState<IssueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState<IssueData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await coreService.getMyIssues();
        if (res.success) {
          setMyIssues(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch issues, ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
