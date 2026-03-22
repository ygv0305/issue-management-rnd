// Node modules
import { Schema, Types, model } from 'mongoose';

export interface IIssueType {
  values: string[];
}

const issueTypeSchema = new Schema<IIssueType>({
  values: [
    {
      type: String,
      maxLength: [50, 'Issue type must be less than 50 characters'],
    },
  ],
});

export default model<IIssueType>('IssueType', issueTypeSchema);
