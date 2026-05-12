/**
 * @fileoverview Service module for retrieving all issues in the system
 * with populated author, type, and assignee details.
 */

// Models
import Issue from '../../models/issueSchema.js';

/**
 * Fetches paginated issue documents from the database, populating related
 * fields (author, type, assignedTo, userTags) with relevant user details.
 *
 * @param page - The current page number.
 * @param limit - The number of issues per page.
 * @returns An object containing paginated issues and the total count.
 * @async
 */
export const fetchAllIssues = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const [data, totalCount] = await Promise.all([
    Issue.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'fullName email')
      .populate('type', 'name')
      .populate('assignedTo', 'fullName email')
      .populate('userTags', 'fullName email')
      .lean()
      .exec(),
    Issue.countDocuments({}),
  ]);

  return { data, totalCount };
};
