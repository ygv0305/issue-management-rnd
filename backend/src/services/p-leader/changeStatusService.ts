/**
 * @fileoverview Service module for updating the status and/or priority of
 * an issue, maintaining an audit trail in the history array.
 */

// Models
import Issue, { type IssuePriority } from '../../models/issueSchema.js';

// Types
import { PLeaderStatusChange } from '../../controllers/p-leader/changeStatusController.js';
import type { Types } from 'mongoose';
import { NotiTypeEnum } from '../../models/notificationSchema.js';

// Services
import { dispatchBulkNotifications } from '../notification/notiDispatcherService.js';

/**
 * Update the status of an issue and log the change in the history array.
 * If both newStatus and newPriority are undefined, the original issue is
 * returned without modification.
 *
 * @param issueId - ID of the issue to update.
 * @param newStatus - The new status value (optional).
 * @param newPriority - The new priority value (optional).
 * @returns The updated Issue document with populated author and type,
 *          or the original issue if no updates were provided.
 * @async
 */

interface UpdateData {
  status?: PLeaderStatusChange;
  urgency?: IssuePriority;
  impact?: IssuePriority;
  resolvedAt?: Date;
}

interface HistoryEntry {
  status?: PLeaderStatusChange;
  urgency?: IssuePriority;
  impact?: IssuePriority;
  timestamp: Date;
}

export const updateIssueStatus = async (
  issueId: string,
  isReopen: boolean,
  actorId?: Types.ObjectId,
  newStatus?: PLeaderStatusChange,
  newUrgency?: IssuePriority,
  newImpact?: IssuePriority,
) => {
  const updateData: UpdateData = {};
  const historyEntry: HistoryEntry = { timestamp: new Date() };

  if (newStatus) {
    updateData.status = newStatus;
    historyEntry.status = newStatus;
    if (newStatus === 'Resolved') {
      updateData.resolvedAt = new Date();
    }
  }
  if (newUrgency) {
    updateData.urgency = newUrgency;
    historyEntry.urgency = newUrgency;
  }
  if (newImpact) {
    updateData.impact = newImpact;
    historyEntry.impact = newImpact;
  }

  // If nothing to update, return the original issue
  if (Object.keys(updateData).length === 0) {
    return await Issue.findById(issueId)
      .populate('author', 'fullName email')
      .populate('type', 'name')
      .populate('assignedTo', 'fullName email')
      .populate('userTags', 'fullName email')
      .lean()
      .exec();
  }

  const updatedIssue = await Issue.findByIdAndUpdate(
    issueId,
    {
      $set: updateData,
      $push: { history: historyEntry },
    },
    { returnDocument: 'after' },
  )
    .populate('author', 'fullName email')
    .populate('type', 'name')
    .populate('assignedTo', 'fullName email')
    .populate('userTags', 'fullName email')
    .lean()
    .exec();

  // Send notifications
  if (updatedIssue && actorId && (newStatus || newUrgency || newImpact)) {
    try {
      let recipients = [
        updatedIssue.author._id,
        ...(updatedIssue.userTags?.map((u) => u._id) || []),
      ];

      if (isReopen && updatedIssue.assignedTo) {
        recipients.push(updatedIssue.assignedTo._id);
      }

      let message = `Issue updated: ${updatedIssue.subject}. `;
      if (newStatus) message += `Status changed to ${newStatus}. `;
      if (newUrgency || newImpact) message += `Priority updated.`;

      await dispatchBulkNotifications(
        recipients,
        actorId,
        updatedIssue._id,
        NotiTypeEnum.StatusChanged,
        message.trim(),
      );
    } catch (error) {
      console.error('Failed to dispatch notifications, ', error);
    }
  }

  return updatedIssue;
};
