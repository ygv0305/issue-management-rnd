// Node modules
import type { Request, Response } from 'express';

// Services
import * as notificationService from '../../services/notification/notificationService.js';

/**
 * Fetches notifications for the authenticated user.
 * Sorted by descending createdAt.
 */
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User is not authenticated',
      });
      return;
    }

    const notifications =
      await notificationService.getUserNotifications(userId);

    res.status(200).json({
      success: true,
      message: 'Notifications fetched successfully',
      data: notifications,
    });
  } catch (error) {
    console.error('Error fetching notifications, ', error);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

/**
 * Marks a specific notification as read.
 */
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Notification ID is not provided',
      });
      return;
    }

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User is not authenticated',
      });
      return;
    }

    const notification = await notificationService.markNotificationAsRead(
      id,
      userId,
    );

    if (!notification) {
      res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
    });
  } catch (error) {
    console.error('Error marking notification as read, ', error);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

/**
 * Marks all notifications for the authenticated user as read.
 */
export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    await notificationService.markAllNotificationsAsRead(userId!);

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    console.error('Error marking all notifications as read, ', error);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};
