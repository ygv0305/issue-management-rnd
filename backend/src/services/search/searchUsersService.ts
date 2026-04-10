/**
 * @fileoverview Service module for searching users by name or email.
 * Provides debounced server-side search functionality for user tagging.
 * @module services/search/searchUsersService
 */

// Models
import User from '../../models/userSchema.js';

// Types
import type { Types } from 'mongoose';

/**
 * Searches for users whose fullName or email matches the query string,
 * excluding the current logged-in user. Results are limited to 10
 * to prevent heavy payloads.
 *
 * @param currentUserId - The MongoDB ObjectId of the requesting user (to exclude from results).
 * @param query - The search string to match against fullName or email.
 * @returns An array of user objects with _id, fullName, and email.
 * @async
 */
export const findMatchingUsers = async (
  currentUserId: string | Types.ObjectId,
  query: string,
) => {
  // Case-insensitive regex for partial matching
  const regex = new RegExp(query, 'i');

  return await User.find(
    {
      $and: [
        { _id: { $ne: currentUserId } }, // Exclude the current user
        {
          $or: [{ fullName: { $regex: regex } }, { email: { $regex: regex } }],
        },
      ],
    },
    '_id fullName email', // Projection: only return these fields
  )
    .limit(10) // Limit to 10 to prevent heavy payloads
    .lean()
    .exec();
};
