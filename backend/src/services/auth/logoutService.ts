/**
 * @fileoverview Service module handling user logout by revoking refresh tokens.
 */

// Models
import RefreshToken from '../../models/refreshTokenSchema.js';

/**
 * Revokes a refresh token by removing it from the database, effectively
 * invalidating the user's session.
 *
 * @param refreshToken - The refresh token string to revoke.
 * @async
 */
export const revokeRefreshToken = async (refreshToken: string) => {
  if (refreshToken) {
    await RefreshToken.deleteOne({ token: refreshToken });
  }
};
