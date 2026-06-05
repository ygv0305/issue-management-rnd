/**
 * @fileoverview Issue schema definition and related utilities.
 * Defines the structure of issue documents, including status tracking,
 * priority management, assignment, user tagging, attachments, and a
 * complete audit trail of status/priority changes via the history array.
 * @module models/issueSchema
 */

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
}

export interface IIssue {
  subject: string;
  description: string;
  type: Types.ObjectId;
  status: IssueStatus;
  urgency: IssuePriority;
  impact: IssuePriority;
  author: Types.ObjectId;
  // Reference to the Paper Leader assigned to handle the issue
  assignedTo: Types.ObjectId;
  // Array of user references for mentions/tags
  userTags: Types.ObjectId[];
  // Array of file attachments with URL and Cloudinary public ID
  attachments: {
    url: string;
    publicId: string;
  }[];
  commentCount: number;
  /** Audit trail recording status and priority changes over time */
  history: {
    status?: IssueStatus;
    urgency?: IssuePriority;
    impact?: IssuePriority;
    timestamp: Date;
  }[];
  resolvedAt: Date;
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
    urgency: {
      type: String,
      enum: Object.values(IssuePriority),
      required: [true, 'Urgency level is required'],
    },
    impact: {
      type: String,
      enum: Object.values(IssuePriority),
      required: [true, 'Impact level is required'],
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
        default: [],
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
        urgency: {
          type: String,
          enum: Object.values(IssuePriority),
        },
        impact: {
          type: String,
          enum: Object.values(IssuePriority),
        },
        timestamp: {
          type: Schema.Types.Date,
          default: Date.now,
        },
      },
    ],
    resolvedAt: {
      type: Schema.Types.Date,
    },
  },
  { timestamps: true },
);

issueSchema.index({ userTags: 1 });
issueSchema.index({ author: 1, createdAt: -1 });
issueSchema.index({ assignedTo: 1, createdAt: -1 });
issueSchema.index({ status: 1, createdAt: -1 });
issueSchema.index({ resolvedAt: 1 }, { sparse: true });

export default model<IIssue>('Issue', issueSchema);
