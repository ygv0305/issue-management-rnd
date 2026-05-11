/**
 * @fileoverview Comment schema definition.
 * Defines the structure of comment documents in MongoDB, associating them
 * with issues and users, and including a timestamp for when the comment was made.
 * @module models/commentSchema
 */

// Node modules
import { Schema, Types, model } from 'mongoose';

/**
 * Interface representing a comment document in the database.
 * @interface
 */
export interface IComment {
  /** Reference to the issue this comment belongs to */
  issueId: Types.ObjectId;
  /** Reference to the user who authored the comment */
  userId: Types.ObjectId;
  /** The comment text content */
  message: string;
  /** The date and time when the comment was created */
  timestamp: Date;
}

/** Mongoose schema for Comment documents */
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

commentSchema.index({ issueId: 1, timestamp: 1 });

/** Mongoose model for Comment documents */
export default model<IComment>('Comment', commentSchema);
