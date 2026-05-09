// Models
import Notification, { NotiTypeEnum } from '../../models/notificationSchema.js';

// Lib
import { emitNotification } from '../../lib/socket.js';

// Types
import type { Types } from 'mongoose';

interface CreateNotificationInput {
  recipient: Types.ObjectId | string;
  actor: Types.ObjectId | string;
  issue: Types.ObjectId | string;
  notiType: NotiTypeEnum;
  message: string;
}

/**
 * Creates a notification in the database and emits it via Socket.io.
 * Prevents self-notification.
 *
 * @param data - The notification data.
 */
export const dispatchNotification = async (data: CreateNotificationInput) => {
  // Prevent self-notification
  if (data.recipient.toString() === data.actor.toString()) {
    return;
  }

  const notification = await Notification.create({
    ...data,
    isRead: false,
  });

  // Emit real-time notification via Socket.io
  emitNotification(data.recipient.toString(), notification);

  return notification;
};

/**
 * Dispatches notifications to multiple recipients.
 *
 * @param recipients - Array of recipient IDs.
 * @param actor - The ID of the user performing the action.
 * @param issue - The ID of the related issue.
 * @param notiType - The type of notification.
 * @param message - The notification message.
 */
export const dispatchBulkNotifications = async (
  recipients: (Types.ObjectId | string)[],
  actor: Types.ObjectId | string,
  issue: Types.ObjectId | string,
  notiType: NotiTypeEnum,
  message: string,
) => {
  // Map to Set to prevent duplication of recipients
  const uniqueRecipients = Array.from(
    new Set(recipients.map((r) => r.toString())),
  );

  const promises = uniqueRecipients.map((recipient) =>
    dispatchNotification({
      recipient,
      actor,
      issue,
      notiType,
      message,
    }),
  );

  return await Promise.all(promises);
};
