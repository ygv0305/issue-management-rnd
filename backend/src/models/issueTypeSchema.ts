/**
 * @fileoverview Issue type schema definition.
 * Defines the structure of issue type documents in MongoDB, which categorize
 * issues (e.g., Bug, Feature, Task). The containIssue array is denormalized
 * for efficient lookup of issues belonging to a type.
 * @module models/issueTypeSchema
 */

// Node modules
import { Schema, Types, model } from 'mongoose';

/**
 * Interface representing an issue type document in the database.
 * @interface
 */
export interface IIssueType {
  /** Name of the issue type (e.g., Bug, Feature, Task) */
  name: string;
  /** Array of issue references that belong to this type (denormalized for easy lookup) */
  containIssue: Types.ObjectId[];
}

/** Mongoose schema for IssueType documents */
const issueTypeSchema = new Schema<IIssueType>(
  {
    name: {
      type: String,
      required: [true, 'Issue type name is required'],
      unique: [true, 'Issue type must be unique'],
      maxLength: [50, 'Issue type name must be less than 50 characters'],
    },
    containIssue: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Issue',
      },
    ], // Denormalised for easy lookup
  },
  { timestamps: true },
);

/** Mongoose model for IssueType documents */
export default model<IIssueType>('IssueType', issueTypeSchema);
