/**
 * @fileoverview Service module handling password setup/creation including
 * token verification, admin user creation, and password updates.
 */

// Models
import User from '../../models/userSchema.js';
import VerificationToken from '../../models/verificationTokenSchema.js';

// Types
import type { Types } from 'mongoose';

/**
 * Verifies that a token exists for the given email address.
 *
 * @param email - The email address to check.
 * @param token - The token string to validate.
 * @returns The VerificationToken document if valid, otherwise null.
 * @async
 */
export const verifyToken = async (email: string, token: string) => {
  return await VerificationToken.findOne({ email, token }).lean().exec();
};

/**
 * Creates a new user document with the Admin role.
 *
 * @param email - The admin user's email address.
 * @param password - The hashed password to set.
 * @returns The newly created User document.
 * @async
 */
export const createAdmin = async (email: string, password: string) => {
  return await User.create({ email, password, role: 'Admin' });
};

/**
 * Updates a user's password and saves the document (which triggers
 * the pre-save hook to re-hash the password).
 *
 * @param email - The email address of the user.
 * @param password - The new plaintext password (will be hashed by the schema hook).
 * @returns The updated User document, or null if the user was not found.
 * @async
 */
export const updatePassword = async (email: string, password: string) => {
  const user = await User.findOne({ email }).exec();
  if (!user) return null;

  user.password = password;
  await user.save();
  return user;
};

/**
 * Deletes a verification token by its MongoDB ObjectId, preventing reuse.
 *
 * @param tokenId - The MongoDB ObjectId of the token to delete.
 * @async
 */
export const deleteToken = async (tokenId: Types.ObjectId) => {
  await VerificationToken.deleteOne({ _id: tokenId });
};
