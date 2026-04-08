// Node modules
import { Schema, Types, model } from 'mongoose';

export interface IIssueType {
  name: string;
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
    ], // Denormalised for easy lookup
  },
  { timestamps: true },
);

export default model<IIssueType>('IssueType', issueTypeSchema);
