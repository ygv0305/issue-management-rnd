// Node modules
import { useState, useEffect } from 'react';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query';

// Services
import notificationService, {
  type INotification,
  type GetNotificationsResponse,
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
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

export const useTopbar = (): UseTopbarReturn => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  // Fetch notifications with infinite query (Load More functionality)
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: QUERY_KEYS.notifications,
      queryFn: async ({ pageParam = 1 }) => {
        // pageParam is automatically updated by getNextPageParam
        const response = await notificationService.getNotifications(
          pageParam as number,
          10,
        );
        return response;
      },
      getNextPageParam: (lastPage) => {
        // Return the next page number, or undefined if we've reached the end
        const { currentPage, totalPages } = lastPage.pagination;
        return currentPage < totalPages
          ? (currentPage as number) + 1
          : undefined;
      },
      initialPageParam: 1,
      enabled: !!user?._id,
    });

  // Flatten the pages into a single array for display
  const notifications = data?.pages.flatMap((page) => page.data) || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Real-time notifications via Socket.io
  useEffect(() => {
    if (user?._id) {
      const socket = getNotiSocket(user._id);

      socket.on('notification', (newNoti: INotification) => {
        // Update Infinite Query cache manually when a new notification arrives via socket
        queryClient.setQueryData<InfiniteData<GetNotificationsResponse>>(
          QUERY_KEYS.notifications,
          (prev) => {
            if (!prev) return prev;

            const updatedPages = [...prev.pages];

            if (newNoti.stacked > 1) {
              // For stacked notifications, search through all loaded pages to find and update the existing one
              let found = false;
              updatedPages.forEach((page, pageIdx) => {
                const itemIdx = page.data.findIndex(
                  (n) => n._id === newNoti._id,
                );
                if (itemIdx !== -1) {
                  const newData = [...page.data];
                  newData[itemIdx] = newNoti;
                  updatedPages[pageIdx] = { ...page, data: newData };
                  found = true;
                }
              });
              if (found) return { ...prev, pages: updatedPages };
            }

            // For unique notifications prepend to the first (newest) page
            const firstPage = { ...updatedPages[0] };
            firstPage.data = [newNoti, ...firstPage.data];
            updatedPages[0] = firstPage;
            return { ...prev, pages: updatedPages };
          },
        );

        // Invalidate other queries
        if (newNoti.notiType === 'IssueCreated') {
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.allIssues] });
        } else if (newNoti.notiType === 'StatusChanged') {
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.myIssues] });
          if (user.role === 'PaperLeader') {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.allIssues] });
          }
        }
      });

      return () => {
        socket.off('notification');
        disconnectSocket();
      };
    }
  }, [user, queryClient]);

  // Mutations
  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: (response, id) => {
      if (response.success) {
        queryClient.setQueryData<InfiniteData<GetNotificationsResponse>>(
          QUERY_KEYS.notifications,
          (prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              pages: prev.pages.map((page) => ({
                ...page,
                data: page.data.map((n) =>
                  n._id === id ? { ...n, isRead: true } : n,
                ),
              })),
            };
          },
        );
      }
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.setQueryData<InfiniteData<GetNotificationsResponse>>(
          QUERY_KEYS.notifications,
          (prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              pages: prev.pages.map((page) => ({
                ...page,
                data: page.data.map((n) => ({ ...n, isRead: true })),
              })),
            };
          },
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
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
