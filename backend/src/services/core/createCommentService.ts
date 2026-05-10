/**
 * @fileoverview Service module for creating comments on issues and updating
 * the associated comment count.
 */

// Models
import Issue from '../../models/issueSchema.js';
import Comment from '../../models/commentSchema.js';

// Types
import { Types } from 'mongoose';
import { NotiTypeEnum } from '../../models/notificationSchema.js';

// Services
import { dispatchBulkNotifications } from '../notification/notiDispatcherService.js';

// Lib
import { emitNewComment } from '../../lib/socket.js';

/** Parameters required to create a new comment. */
interface CreateCommentParams {
  /** The MongoDB ObjectId of the issue to comment on. */
  issueId: string;
  /** The MongoDB ObjectId of the user creating the comment. */
  userId: string | Types.ObjectId;
  /** The comment message text. */
  message: string;
}

/**
 * Creates a new comment in the database and increments the associated
 * issue's commentCount. The returned comment is populated with the
 * author's email and fullName.
 *
 * @param params - Object containing issueId, userId, and message.
 * @returns The newly created Comment document with populated userId.
 * @async
 */
const createCommentService = async ({
  issueId,
  userId,
  message,
}: CreateCommentParams) => {
  const newComment = await Comment.create({
    issueId: new Types.ObjectId(issueId),
    userId: new Types.ObjectId(userId),
    message,
    timestamp: new Date(),
  });

  // Increment commentCount in Issue and fetch it for notification logic
  const issue = await Issue.findByIdAndUpdate(
    issueId,
    { $inc: { commentCount: 1 } },
    { returnDocument: 'after' },
  );

  // Send notifications
  if (issue) {
    try {
      const actorId = userId.toString();
      const authorId = issue.author.toString();
      const assignedId = issue.assignedTo?.toString();
      const taggedIds = issue.userTags?.map((u) => u.toString()) || [];

      const recipientsSet = new Set<string>();

      if (actorId === authorId) {
        // Author comments -> Notify Assigned PaperLeader + Tagged
        if (assignedId) recipientsSet.add(assignedId);
        taggedIds.forEach((id) => recipientsSet.add(id));
      } else if (assignedId && actorId === assignedId) {
        // Assigned PaperLeader comments -> Notify Author + Tagged
        recipientsSet.add(authorId);
        taggedIds.forEach((id) => recipientsSet.add(id));
      } else {
        // Third party comments -> Notify Author + Assigned PaperLeader + Tagged
        recipientsSet.add(authorId);
        if (assignedId) recipientsSet.add(assignedId);
        taggedIds.forEach((id) => recipientsSet.add(id));
      }

      // Convert Set back to Array
      const recipients = Array.from(recipientsSet);

      await dispatchBulkNotifications(
        recipients,
        actorId,
        issue._id,
        NotiTypeEnum.NewComment,
        // `New comment on issue ${issue.subject}: ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}`,
        `New comment on issue ${issue.subject}.`,
      );
    } catch (error) {
      console.error(
        'Failed to dispatch notifications for new comment, ',
        error,
      );
    }
  }

  const populatedComment = await newComment.populate(
    'userId',
    'email fullName',
  );

  // Emit to socket room for real-time update
  emitNewComment(issueId, populatedComment);

  return populatedComment;
};

export default createCommentService;
