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

interface StackedNotiQueryProps {
  recipient: Types.ObjectId | string;
  notiType: NotiTypeEnum;
  isRead: boolean;
  issue?: Types.ObjectId | string;
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

  // Handle stacked notifications
  if (
    data.notiType === NotiTypeEnum.IssueCreated ||
    data.notiType === NotiTypeEnum.NewComment
  ) {
    const query: StackedNotiQueryProps = {
      recipient: data.recipient,
      notiType: data.notiType,
      isRead: false,
    };

    if (data.notiType === NotiTypeEnum.NewComment) {
      query.issue = data.issue;
    }

    // Find the latest unread notification
    const latestNoti = await Notification.findOne(query)
      .sort({
        createdAt: -1,
      })
      .populate('issue', 'subject');

    if (latestNoti) {
      const newStacked = (latestNoti.stacked || 1) + 1;
      latestNoti.stacked = newStacked;
      // Cast to unknown to force TS to safely handles the populated subject from latestNoti
      const subject = (latestNoti.issue as unknown as { subject: string })
        .subject;

      // Update message based on type
      if (data.notiType === NotiTypeEnum.IssueCreated) {
        latestNoti.message = `${newStacked} new issues submitted.`;
      } else {
        latestNoti.message = `${newStacked} new comments on issue ${subject}.`;
      }

      const updatedNoti = await latestNoti.save();

      emitNotification(data.recipient.toString(), updatedNoti);
      return updatedNoti;
    }
  }

  const notification = await Notification.create({
    ...data,
    isRead: false,
    stacked: 1,
  });

  // Populate actor and issue for frontend consistency
  await notification.populate([
    { path: 'actor', select: 'fullName' },
    { path: 'issue', select: 'subject' },
  ]);

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
