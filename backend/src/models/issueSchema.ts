// Node modules
import { Schema, Types, model } from 'mongoose';

export interface IIssue {
  subject: string;
  description: string;
  type: Schema.Types.ObjectId;
  status:
    | 'New'
    | 'Assigned'
    | 'InProgress'
    | 'Resolved'
    | 'Rejected'
    | 'ReOpen'
    | 'Closed';
  author: Types.ObjectId;
  authorType: 'Individual' | 'ProjectGroup';
  projectGroup: Types.ObjectId; // Null if Individual
  assignedTo: Types.ObjectId; // Paper Leader assigned
  attachments: {
    url: string;
    publicId: string;
  }[];
  thread: {
    userId: Types.ObjectId;
    message: string;
    timestamp: Date;
  }[];
  history: {
    status:
      | 'New'
      | 'Assigned'
      | 'InProgress'
      | 'Resolved'
      | 'Rejected'
      | 'ReOpen'
      | 'Closed';
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
      enum: {
        values: [
          'New',
          'Assigned',
          'InProgress',
          'Resolved',
          'Rejected',
          'ReOpen',
          'Closed',
        ],
        message: '{VALUE} status is not supported',
      },
      default: 'New',
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    authorType: {
      type: String,
      enum: {
        values: ['Individual', 'ProjectGroup'],
        message: '{VALUE} is not supported',
      },
      required: [true, 'Author type is required'],
    },
    projectGroup: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
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
    thread: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: [true, 'Comment author is required'],
        },
        message: {
          type: String,
          required: [true, 'Comment message is required'],
          maxLength: [1000, 'Comment must be less than 1000 characters'],
        },
        timestamp: {
          type: Schema.Types.Date,
          default: Date.now,
        },
      },
    ],
    history: [
      {
        status: {
          type: String,
          enum: {
            values: [
              'New',
              'Assigned',
              'InProgress',
              'Resolved',
              'Rejected',
              'ReOpen',
              'Closed',
            ],
            message: '{VALUE} status is not supported',
          },
          required: [true, 'Status change is required'],
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
