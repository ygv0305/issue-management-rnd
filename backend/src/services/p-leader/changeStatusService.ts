/**
 * @fileoverview Service module for updating the status and/or priority of
 * an issue, maintaining an audit trail in the history array.
 */

// Models
import Issue, { IssueStatus, IssuePriority } from '../../models/issueSchema.js';

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
export const updateIssueStatus = async (
  issueId: string,
  newStatus?: IssueStatus,
  newPriority?: IssuePriority,
) => {
  const updateData: any = {};
  const historyEntry: any = { timestamp: new Date() };

  if (newStatus) {
    updateData.status = newStatus;
    historyEntry.status = newStatus;
  }
  if (newPriority) {
    updateData.priority = newPriority;
    historyEntry.priority = newPriority;
  }

  // If nothing to update, return the original issue
  if (Object.keys(updateData).length === 0) {
    return await Issue.findById(issueId)
      .populate('author', 'fullName email')
      .populate('type', 'name')
      .lean()
      .exec();
  }

  return await Issue.findByIdAndUpdate(
    issueId,
    {
      $set: updateData,
      $push: { history: historyEntry },
    },
    { returnDocument: 'after' },
  )
    .populate('author', 'fullName email')
    .populate('type', 'name')
    .lean()
    .exec();
};
