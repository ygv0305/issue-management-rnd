// Models
import Issue, { IssueStatus, IssuePriority } from '../../models/issueSchema.js';

/**
 * Update the status of an issue and log the change in the history array.
 * @param issueId - ID of the issue to update.
 * @param newStatus - The new status value.
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
