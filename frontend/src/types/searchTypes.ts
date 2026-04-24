/**
 * @fileoverview Type definitions for user search functionality.
 * Defines request/response shapes and data models for searching users
 * to tag in issues.
 * @module types/searchTypes
 */

// Request
/**
 * Parameters for searching users via the API.
 */
export interface SearchUsersParams {
  /** The search query string to match against user name or email */
  q: string;
}

// Response
/**
 * Response from the search users API endpoint.
 */
export interface SearchUsersResponse {
  /** Whether the request was successful */
  success: boolean;
  /** Human-readable message about the result */
  message: string;
  /** Array of matched user objects */
  data: SearchedUserData[];
}

// Data models
/**
 * Represents a user returned from the search API.
 */
export interface SearchedUserData {
  /** User's unique MongoDB identifier */
  _id: string;
  /** User's full display name */
  fullName: string;
  /** User's email address */
  email: string;
}
