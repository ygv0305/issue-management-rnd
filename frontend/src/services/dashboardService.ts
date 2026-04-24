// API
import apiAuth from '../lib/api/axiosAuth';

// Types
import type {
  QuickStatsResponse,
  PriorityMatrixItem,
  IssuesByTypeItem,
  IssueTypePercentageItem,
} from '../types/dashboardTypes';

export const getQuickStats = async (): Promise<QuickStatsResponse> => {
  const response = await apiAuth.get('/dashboard/quick-stats');
  return response.data.data;
};

export const getPriorityMatrix = async (): Promise<PriorityMatrixItem[]> => {
  const response = await apiAuth.get('/dashboard/priority-matrix');
  return response.data.data;
};

export const getIssuesByType = async (): Promise<IssuesByTypeItem[]> => {
  const response = await apiAuth.get('/dashboard/issues-by-type');
  return response.data.data;
};

export const getIssueTypePercentage = async (): Promise<
  IssueTypePercentageItem[]
> => {
  const response = await apiAuth.get('/dashboard/issue-type-percentage');
  return response.data.data;
};
