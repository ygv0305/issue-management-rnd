// Node modules
import { useState, useMemo, useCallback } from 'react';
import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';

// Services
import coreService from '../../services/coreService';

// Lib
import { useUser } from '../../lib/context/UserContext';
import { QUERY_KEYS } from '../../lib/react-query/queryKeys';

// Types
import type { IssueData } from '../../types/issueTypes';

// MUI
import type { GridPaginationModel } from '@mui/x-data-grid';

interface UseMyIssuesReturn {
  submittedIssues: IssueData[];
  taggedIssues: IssueData[];
  submittedLoading: boolean;
  taggedLoading: boolean;
  selectedIssue: IssueData | null;
  setSelectedIssue: (issue: IssueData | null) => void;
  handleIssueUpdated: (updatedIssue: IssueData) => void;
  submittedPagination: GridPaginationModel;
  setSubmittedPagination: (model: GridPaginationModel) => void;
  submittedTotal: number;
  taggedPagination: GridPaginationModel;
  setTaggedPagination: (model: GridPaginationModel) => void;
  taggedTotal: number;
}

export const useMyIssues = (): UseMyIssuesReturn => {
  const { user } = useUser();
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Separate pagination state for the "Submitted" table
  const [submittedPagination, setSubmittedPagination] =
    useState<GridPaginationModel>({
      page: 0,
      pageSize: 10,
    });

  // Separate pagination state for the "Tagged" table
  const [taggedPagination, setTaggedPagination] = useState<GridPaginationModel>(
    {
      page: 0,
      pageSize: 10,
    },
  );

  // Fetch only the issues created by the current user
  const { data: submittedData, isLoading: submittedLoading } = useQuery({
    queryKey: [
      ...QUERY_KEYS.myIssues.mySubmitted,
      submittedPagination.page,
      submittedPagination.pageSize,
    ],
    queryFn: async () => {
      const res = await coreService.getMySubmittedIssues(
        submittedPagination.page + 1,
        submittedPagination.pageSize,
      );
      return res.success ? res : { data: [], pagination: { totalItems: 0 } };
    },
    enabled: !!user?._id,
    placeholderData: keepPreviousData,
  });

  // Fetch only the issues where the current user is tagged
  const { data: taggedData, isLoading: taggedLoading } = useQuery({
    queryKey: [
      ...QUERY_KEYS.myIssues.myTagged,
      taggedPagination.page,
      taggedPagination.pageSize,
    ],
    queryFn: async () => {
      const res = await coreService.getMyTaggedIssues(
        taggedPagination.page + 1,
        taggedPagination.pageSize,
      );
      return res.success ? res : { data: [], pagination: { totalItems: 0 } };
    },
    enabled: !!user?._id,
    placeholderData: keepPreviousData,
  });

  const submittedIssues = useMemo(
    () => submittedData?.data || [],
    [submittedData],
  );
  const submittedTotal = submittedData?.pagination?.totalItems || 0;

  const taggedIssues = useMemo(() => taggedData?.data || [], [taggedData]);
  const taggedTotal = taggedData?.pagination?.totalItems || 0;

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
      // Invalidate queries to ensure we get fresh data with correct pagination
      queryClient.invalidateQueries({ queryKey: ['myIssues'] });

      if (user?.role === 'PaperLeader' && updatedIssue) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.allIssues });
      }
    },
    [queryClient, user?.role],
  );

  return {
    submittedIssues,
    taggedIssues,
    submittedLoading,
    taggedLoading,
    selectedIssue,
    setSelectedIssue,
    handleIssueUpdated,
    submittedPagination,
    setSubmittedPagination,
    submittedTotal,
    taggedPagination,
    setTaggedPagination,
    taggedTotal,
  };
};
