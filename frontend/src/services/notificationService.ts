// Lib
import apiAuth from '../lib/api/axiosAuth';

// Types
import type { PaginationData } from '../types/issueTypes';

export interface INotification {
  _id: string;
  recipient: string;
  actor: {
    _id: string;
    fullName: string;
  };
  issue: {
    _id: string;
    subject: string;
  };
  notiType: 'IssueCreated' | 'IssueTagged' | 'StatusChanged' | 'NewComment';
  message: string;
  isRead: boolean;
  stacked: number;
  createdAt: string;
}

export interface GetNotificationsResponse {
  success: boolean;
  message: string;
  data: INotification[];
  pagination: PaginationData;
}

class NotificationService {
  async getNotifications(
    page: number = 1,
    limit: number = 10,
  ): Promise<GetNotificationsResponse> {
    const response = await apiAuth.get<GetNotificationsResponse>(
      `/notifications?page=${page}&limit=${limit}`,
    );
    return response.data;
  }

  async markAsRead(id: string): Promise<{ success: boolean }> {
    const response = await apiAuth.patch<{ success: boolean }>(
      `/notifications/${id}/read`,
    );
    return response.data;
  }

  async markAllAsRead(): Promise<{ success: boolean }> {
    const response = await apiAuth.patch<{ success: boolean }>(
      '/notifications/read-all',
    );
    return response.data;
  }
}

export default new NotificationService();
