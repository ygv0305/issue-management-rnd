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

// Types
import type { Types } from 'mongoose';
import { IssuePriority } from '../../models/issueSchema.js';
import { IssueStatus } from '../../models/issueSchema.js';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

/** Input data required to create a new issue. */
interface CreateIssueInput {
  /** Brief title for the issue. */
  subject: string;
  /** Detailed description (HTML content, will be sanitized). */
  description: string;
  /** Reference to the issue type/category. */
  type: Types.ObjectId;
  /** Priority level of the issue. */
  priority: IssuePriority;
  /** Reference to the user creating the issue. */
  author: Types.ObjectId;
  /** Optional array of file attachments with URL and Cloudinary public ID. */
  attachments?: { url: string; publicId: string }[];
  /** Optional array of users tagged in the issue */
  userTags?: Types.ObjectId[];
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

  const issueData = {
    ...data,
    description: cleanDescription,
    status: IssueStatus.New,
    history: [
      {
        status: IssueStatus.New,
        timestamp: new Date(),
      },
    ],
  };

  return await Issue.create(issueData as any);
};

/**
 * Validate tagged users if they exist in the database
 *
 * @param userTags - An array of tagged IDs
 */
export const validateUserTags = async (userTags: Types.ObjectId[]) => {
  return await User.find({ _id: { $in: userTags } });
};
