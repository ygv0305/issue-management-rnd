/**
 * @fileoverview Issue type schema definition.
 * Defines the structure of issue type documents, which categorize
 * issues (e.g., Bug, Feature, Task). The containIssue array is denormalised
 * for efficient lookup of issues belonging to a type.
 * @module models/issueTypeSchema
 */

// Node modules
import { Schema, Types, model } from 'mongoose';

export interface IIssueType {
  name: string;
  // Array of issue references that belong to this type (denormalised for easy lookup)
  containIssue: Types.ObjectId[];
}

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
    ],
  },
  { timestamps: true },
);

export default model<IIssueType>('IssueType', issueTypeSchema);
