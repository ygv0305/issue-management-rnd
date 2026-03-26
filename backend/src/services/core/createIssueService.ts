// Models
import Issue from '../../models/issueSchema.js';

// Node modules
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Types
import type { Types } from 'mongoose';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

interface CreateIssueInput {
  subject: string;
  description: string;
  type: string | Types.ObjectId;
  author: string | Types.ObjectId;
  attachments?: { url: string; publicId: string }[];
}

export const createIssueDb = async (data: CreateIssueInput) => {
  const cleanDescription = purify.sanitize(data.description);

  const issueData = {
    ...data,
    description: cleanDescription,
    status: 'New',
    history: [
      {
        status: 'New',
        timestamp: new Date(),
      },
    ],
  };

  return await Issue.create(issueData as any);
};
