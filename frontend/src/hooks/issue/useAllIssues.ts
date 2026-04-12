// Node modules
import { useEffect, useState, useCallback } from 'react';

// Services
import pLeaderService from '../../services/pLeaderService';

// Types
import type { IssueData } from '../../types/issueTypes';

interface UseAllIssuesReturn {
  allIssues: IssueData[];
  loading: boolean;
  selectedIssue: IssueData | null;
  setSelectedIssue: (issue: IssueData | null) => void;
  handleIssueUpdated: (updatedIssue: IssueData) => void;
}

export const useAllIssues = (): UseAllIssuesReturn => {
  const [allIssues, setAllIssues] = useState<IssueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState<IssueData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await pLeaderService.getAllIssues();
        if (res.success) {
          setAllIssues(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch issues, ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleIssueUpdated = useCallback((updatedIssue: IssueData) => {
    setAllIssues((prev) =>
      prev.map((issue) =>
        issue._id === updatedIssue._id ? updatedIssue : issue,
      ),
    );
  }, []);

  return {
    allIssues,
    loading,
    selectedIssue,
    setSelectedIssue,
    handleIssueUpdated,
  };
};
