// Models
import IssueType from '../../models/issueTypeSchema.js';

export const fetchAllIssueTypes = async () => {
  return await IssueType.find({}).lean().exec();
};
