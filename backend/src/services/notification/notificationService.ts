// Node modules
import { Types } from 'mongoose';

// Models
import Notification from '../../models/notificationSchema.js';

/**
 * Fetches notifications for a specific user with pagination.
 * @param userId - The ID of the recipient user.
 * @param page - Current page number.
 * @param limit - Number of items per page.
 * @returns An object containing paginated notifications and the total count.
 */
export const getUserNotifications = async (
  userId: string | Types.ObjectId,
  page: number,
  limit: number,
) => {
  const skip = (page - 1) * limit;

  const [data, totalCount] = await Promise.all([
    Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('actor', 'fullName')
      .populate('issue', 'subject')
      .lean(),
    Notification.countDocuments({ recipient: userId }),
  ]);

  return { data, totalCount };
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
