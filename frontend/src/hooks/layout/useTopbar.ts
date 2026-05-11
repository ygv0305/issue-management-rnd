// Node modules
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Services
import notificationService, {
  type INotification,
} from '../../services/notificationService';

// Lib
import { getNotiSocket, disconnectSocket } from '../../lib/socket';
import { useUser } from '../../lib/context/UserContext';
import { QUERY_KEYS } from '../../lib/react-query/queryKeys';

interface UseTopbarReturn {
  userName: string;
  userInitials: string;
  notifications: INotification[];
  unreadCount: number;
  anchorEl: HTMLElement | null;
  handleNotificationClick: (event: React.MouseEvent<HTMLElement>) => void;
  handleClose: () => void;
  handleProfileClick: () => void;
  handleMarkAsRead: (id: string) => Promise<void>;
  handleMarkAllAsRead: () => Promise<void>;
}

export const useTopbar = (): UseTopbarReturn => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  // Fetch notifications with React Query
  const { data: notifications = [] } = useQuery({
    queryKey: QUERY_KEYS.notifications,
    queryFn: async () => {
      const response = await notificationService.getNotifications();
      return response.data;
    },
    enabled: !!user?._id,
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Real-time notifications via Socket.io
  useEffect(() => {
    if (user?._id) {
      const socket = getNotiSocket(user._id);

      socket.on('notification', (newNoti: INotification) => {
        // Update React Query cache when new notification arrives
        queryClient.setQueryData<INotification[]>(
          QUERY_KEYS.notifications,
          (prev) => {
            if (!prev) return [newNoti];

            // If it's a stacked notification, update the existing one in the list
            if (newNoti.stacked > 1) {
              const exists = prev.some((n) => n._id === newNoti._id);
              if (exists) {
                return prev.map((n) => (n._id === newNoti._id ? newNoti : n));
              }
            }

            // Otherwise, add to the top
            return [newNoti, ...prev];
          },
        );

        if (newNoti.notiType === 'IssueCreated') {
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.allIssues });
        } else if (newNoti.notiType === 'StatusChanged') {
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myIssues });
          if (user.role === 'PaperLeader') {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.allIssues });
          }
        }
      });

      return () => {
        socket.off('notification');
        disconnectSocket();
      };
    }
  }, [user, queryClient]);

  // Mutation for marking a single notification as read
  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: (response, id) => {
      if (response.success) {
        queryClient.setQueryData<INotification[]>(
          QUERY_KEYS.notifications,
          (prev) =>
            prev?.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
        );
      }
    },
  });

  // Mutation for marking all notifications as read
  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.setQueryData<INotification[]>(
          QUERY_KEYS.notifications,
          (prev) => prev?.map((n) => ({ ...n, isRead: true })),
        );
      }
    },
  });

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsReadMutation.mutateAsync(id);
    } catch (error) {
      console.error('Failed to mark notification as read, ', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadMutation.mutateAsync();
    } catch (error) {
      console.error('Failed to mark all as read, ', error);
    }
  };

  const handleProfileClick = () => {
    alert(
      `My Profile\n\nName: ${user?.fullName || 'Guest'}\nEmail: ${user?.email}\nRole: ${user?.role}`,
    );
  };

  const getUserInitials = (): string => {
    if (user?.fullName) {
      return user.fullName.charAt(0).toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  return {
    userName: user?.fullName || 'Guest',
    userInitials: getUserInitials(),
    notifications,
    unreadCount,
    anchorEl,
    handleNotificationClick,
    handleClose,
    handleProfileClick,
    handleMarkAsRead,
    handleMarkAllAsRead,
  };
};
