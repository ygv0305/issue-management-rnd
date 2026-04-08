// Node modules
import { Schema, Types, model } from 'mongoose';

export enum IssueStatus {
  New = 'New',
  InProgress = 'InProgress',
  Resolved = 'Resolved',
  ReOpen = 'ReOpen',
  Closed = 'Closed',
}

export enum IssuePriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical',
}

export interface IIssue {
  subject: string;
  description: string;
  type: Schema.Types.ObjectId;
  status: IssueStatus;
  priority: IssuePriority;
  author: Types.ObjectId;
  assignedTo: Types.ObjectId; // Paper Leader assigned
  userTags: Types.ObjectId[];
  attachments: {
    url: string;
    publicId: string;
  }[];
  commentCount: number;
  history: {
    status?: IssueStatus;
    priority?: IssuePriority;
    timestamp: Date;
  }[]; // Audit trail
}

const issueSchema = new Schema<IIssue>(
  {
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      maxLength: [50, 'Subject must be less than 50 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxLength: [1000, 'Description must be less than 1000 characters'],
    },
    type: {
      type: Schema.Types.ObjectId,
      required: [true, 'Issue type is required'],
      ref: 'IssueType',
    },
    status: {
      type: String,
      enum: Object.values(IssueStatus),
      default: IssueStatus.New,
    },
    priority: {
      type: String,
      enum: Object.values(IssuePriority),
      required: [true, 'Issue priority is required'],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    userTags: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    attachments: [
      {
        url: {
          type: String,
          required: [true, 'Attachments URL is required'],
        },
        publicId: {
          type: String,
          required: [true, 'Attachments public ID is required'],
        },
      },
    ],
    commentCount: {
      type: Number,
      default: 0,
    },
    history: [
      {
        status: {
          type: String,
          enum: Object.values(IssueStatus),
        },
        priority: {
          type: String,
          enum: Object.values(IssuePriority),
        },
        timestamp: {
          type: Schema.Types.Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
);

export default model<IIssue>('Issue', issueSchema);
