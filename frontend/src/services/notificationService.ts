// Lib
import apiAuth from '../lib/api/axiosAuth';

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
  notiType: 'IssueCreated' | 'StatusChanged' | 'NewComment';
  message: string;
  isRead: boolean;
  stacked: number;
  createdAt: string;
}

interface GetNotificationsResponse {
  success: boolean;
  message: string;
  data: INotification[];
}

class NotificationService {
  async getNotifications(): Promise<GetNotificationsResponse> {
    const response =
      await apiAuth.get<GetNotificationsResponse>('/notifications');
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
