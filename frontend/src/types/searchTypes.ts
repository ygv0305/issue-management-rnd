/* Requests */

export interface SearchUsersParams {
  // The search query string to match against user name or email
  q: string;
}

/* Responses */

export interface SearchUsersResponse {
  success: boolean;
  message: string;
  data: SearchedUserData[];
}

/* Data models */
export interface SearchedUserData {
  _id: string;
  fullName: string;
  email: string;
}
