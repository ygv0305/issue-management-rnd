// Models
import Issue from '../../models/issueSchema.js';

// Node modules
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Types
import type { Types } from 'mongoose';
import { IssuePriority } from '../../models/issueSchema.js';
import { IssueStatus } from '../../models/issueSchema.js';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

interface CreateIssueInput {
  subject: string;
  description: string;
  type: Types.ObjectId;
  priority: IssuePriority;
  author: Types.ObjectId;
  attachments?: { url: string; publicId: string }[];
}

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
