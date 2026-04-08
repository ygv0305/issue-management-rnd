// Node modules
import { Schema, Types, model } from 'mongoose';

export interface IComment {
  issueId: Types.ObjectId;
  userId: Types.ObjectId;
  message: string;
  timestamp: Date;
}

const commentSchema = new Schema<IComment>(
  {
    issueId: {
      type: Schema.Types.ObjectId,
      ref: 'Issue',
      required: [true, 'Issue ID is required'],
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      maxLength: [1000, 'Comment must be less than 1000 characters'],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export default model<IComment>('Comment', commentSchema);
