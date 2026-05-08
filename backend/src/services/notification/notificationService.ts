// Node modules
import { Types } from 'mongoose';

// Models
import Notification from '../../models/notificationSchema.js';

/**
 * Fetches notifications for a specific user.
 * @param userId - The ID of the recipient user.
 */
export const getUserNotifications = async (userId: string | Types.ObjectId) => {
  return await Notification.find({ recipient: userId })
    .sort({ createdAt: -1 })
    .populate('actor', 'fullName')
    .populate('issue', 'subject')
    .lean();
};

/**
 * Marks a specific notification as read.
 * @param id - The ID of the notification.
 * @param userId - The ID of the user (to ensure ownership).
 */
export const markNotificationAsRead = async (
  id: string | string[] | Types.ObjectId,
  userId: string | Types.ObjectId,
) => {
  return await Notification.findOneAndUpdate(
    { _id: id, recipient: userId },
    { isRead: true },
    { returnDocument: 'after' },
  );
};

/**
 * Marks all notifications for a specific user as read.
 * @param userId - The ID of the recipient user.
 */
export const markAllNotificationsAsRead = async (
  userId: string | Types.ObjectId,
) => {
  return await Notification.updateMany(
    { recipient: userId, isRead: false },
    { isRead: true },
  );
};
