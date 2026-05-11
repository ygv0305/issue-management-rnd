/**
 * CoreService handles issue and comment management API calls.
 *
 * Methods:
 * - getIssueTypes(): Fetch all available issue type definitions
 * - getMyIssues(): Fetch issues created by the current user
 * - createIssue(): Create a new issue with attachments
 * - createComment(): Add a comment to an issue
 * - fetchComments(): Get all comments for a specific issue
 * - reOpenIssue(): Change an issue status from Resolved to ReOpen
 *
 * Available to all authenticated users.
 */

// API
import apiAuth from '../lib/api/axiosAuth';

// Types
import type * as IssueTypes from '../types/issueTypes';

class CoreService {
  async getIssueTypes(): Promise<IssueTypes.GetIssueTypesResponse> {
    const response = await apiAuth.get<IssueTypes.GetIssueTypesResponse>(
      '/core-base/issue-types',
    );
    return response.data;
  }

  async getMyIssues(): Promise<IssueTypes.GetIssuesResponse> {
    const response = await apiAuth.get<IssueTypes.GetIssuesResponse>(
      '/core-base/my-issues',
    );
    return response.data;
  }

  async createIssue(
    data: IssueTypes.CreateIssueData,
  ): Promise<IssueTypes.GetIssuesResponse> {
    const response = await apiAuth.post('/core-base/create-issue', data);
    return response.data;
  }

  async createComment(
    data: IssueTypes.CreateCommentData,
  ): Promise<IssueTypes.CommentResponse> {
    const response = await apiAuth.post('/core-base/create-comment', data);
    return response.data;
  }

  async fetchComments(
    issueId: string,
  ): Promise<IssueTypes.FetchCommentsResponse> {
    const response = await apiAuth.get<IssueTypes.FetchCommentsResponse>(
      `/core-base/fetch-comments?issueId=${issueId}`,
    );
    return response.data;
  }

  async reOpenIssue(
    data: IssueTypes.ChangeStatusData,
  ): Promise<IssueTypes.ChangeStatusResponse> {
    const response = await apiAuth.patch('/core-base/reopen-issue', data);
    return response.data;
  }
}

export default new CoreService();
