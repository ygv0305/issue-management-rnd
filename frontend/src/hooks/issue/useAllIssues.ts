// Node modules
import { useState, useCallback, useMemo } from 'react';
import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';

// Services
import pLeaderService from '../../services/pLeaderService';

// Types
import type { IssueData } from '../../types/issueTypes';

// Lib
import { QUERY_KEYS } from '../../lib/react-query/queryKeys';
import { useUser } from '../../lib/context/UserContext';

// MUI
import type { GridPaginationModel } from '@mui/x-data-grid';

interface UseAllIssuesReturn {
  allIssues: IssueData[];
  loading: boolean;
  selectedIssue: IssueData | null;
  setSelectedIssue: (issue: IssueData | null) => void;
  handleIssueUpdated: (updatedIssue: IssueData) => void;
  paginationModel: GridPaginationModel;
  setPaginationModel: (model: GridPaginationModel) => void;
  totalCount: number;
}

export const useAllIssues = (): UseAllIssuesReturn => {
  const queryClient = useQueryClient();
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const { user } = useUser();

  // Server-side pagination state for DataGrid
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0, // MUI DataGrid uses 0-based indexing for pages
    pageSize: 10,
  });

  // Fetch issues from backend with pagination
  const { data, isLoading: loading } = useQuery({
    // Include page and pageSize in queryKey to trigger refetch when they change
    queryKey: [
      QUERY_KEYS.allIssues,
      paginationModel.page,
      paginationModel.pageSize,
    ],
    queryFn: async () => {
      const res = await pLeaderService.getAllIssues(
        paginationModel.page + 1, // Backend uses 1-based indexing
        paginationModel.pageSize,
      );
      return res.success ? res : { data: [], pagination: { totalItems: 0 } };
    },
    placeholderData: keepPreviousData,
  });

  const allIssues = useMemo(() => data?.data || [], [data]);
  const totalCount = data?.pagination?.totalItems || 0;

  // Memoize the selected issue
  const selectedIssue = useMemo(
    () => allIssues.find((issue) => issue._id === selectedIssueId) || null,
    [allIssues, selectedIssueId],
  );

  const setSelectedIssue = useCallback((issue: IssueData | null) => {
    setSelectedIssueId(issue?._id || null);
  }, []);

  const handleIssueUpdated = useCallback(
    (updatedIssue: IssueData) => {
      // Invalidate queries to ensure we get fresh data with correct pagination
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.allIssues] });

      // Update MyIssues page as well
      if (
        updatedIssue.author._id === user?._id ||
        updatedIssue.userTags.some((u) => u._id === user?._id)
      ) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.myIssues] });
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
    paginationModel,
    setPaginationModel,
    totalCount,
  };
};
