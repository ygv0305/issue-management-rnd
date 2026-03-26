// Models
import IssueType from '../../models/issueTypeSchema.js';

export const checkIssueTypeExist = async (name: string) => {
  return await IssueType.findOne({ name }).lean().exec();
};

export const createIssueTypeDb = async (name: string) => {
  return await IssueType.create({ name });
};
