/**
 * @fileoverview Service module for creating new issues, including HTML sanitization
 * and initial status/history setup.
 */

// Models
import Issue from '../../models/issueSchema.js';
import User from '../../models/userSchema.js';

// Node modules
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import type { Types } from 'mongoose';

// Types
import { IssuePriority } from '../../models/issueSchema.js';
import { IssueStatus } from '../../models/issueSchema.js';
import { NotiTypeEnum } from '../../models/notificationSchema.js';
import { SystemRoles } from '../../models/userSchema.js';

// Services
import { dispatchBulkNotifications } from '../notification/notiDispatcherService.js';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

interface CreateIssueInput {
  subject: string;
  description: string;
  type: Types.ObjectId;
  urgency: IssuePriority;
  impact: IssuePriority;
  author: Types.ObjectId;
  // Optional array of file attachments with URL and Cloudinary public ID
  attachments?: { url: string; publicId: string }[];
  // Optional array of users tagged in the issue
  userTags?: Types.ObjectId[];
  status?: IssueStatus;
  history?: {
    status?: IssueStatus;
    urgency?: IssuePriority;
    impact?: IssuePriority;
    timestamp: Date;
  }[];
}

/**
 * Sanitizes the issue description and persists the new issue to the database
 * with an initial status of "New" and a history entry.
 *
 * @param data - The issue input data conforming to CreateIssueInput.
 * @returns The newly created Issue document.
 * @async
 */
export const createIssueDb = async (data: CreateIssueInput) => {
  const cleanDescription = purify.sanitize(data.description);

  const issueData: CreateIssueInput = {
    ...data,
    description: cleanDescription,
    status: IssueStatus.New,
    history: [
      {
        status: IssueStatus.New,
        urgency: data.urgency,
        impact: data.impact,
        timestamp: new Date(),
      },
    ],
  };

  const newIssue = await Issue.create(issueData);

  // Notify all PaperLeaders
  try {
    const paperLeaders = await User.find({
      role: SystemRoles.PaperLeader,
    }).select('_id');
    const recipientIds = paperLeaders.map((pl) => pl._id);

    await dispatchBulkNotifications(
      recipientIds,
      data.author,
      newIssue._id,
      NotiTypeEnum.IssueCreated,
      `New issue submitted: ${data.subject}`,
    );
  } catch (error) {
    console.error(
      'Failed to dispatch notifications to PaperLeaders for new issue, ',
      error,
    );
  }

  // Notify all tagged users
  if (data.userTags && data.userTags.length > 0) {
    try {
      const recipientIds = data.userTags;

      await dispatchBulkNotifications(
        recipientIds,
        data.author,
        newIssue._id,
        NotiTypeEnum.IssueTagged,
        `You are tagged in an issue: ${data.subject}`,
      );
    } catch (error) {
      console.error(
        'Failed to dispatch notifications to tagged users for new issue, ',
        error,
      );
    }
  }

  return newIssue;
};

/**
 * Validate tagged users if they exist in the database
 *
 * @param userTags - An array of tagged IDs
 */
export const validateUserTags = async (userTags: Types.ObjectId[]) => {
  return await User.find({ _id: { $in: userTags } });
};
