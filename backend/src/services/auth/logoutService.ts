// Models
import RefreshToken from '../../models/refreshToken.js';

export const revokeRefreshToken = async (refreshToken: string) => {
  if (refreshToken) {
    await RefreshToken.deleteOne({ token: refreshToken });
  }
};
