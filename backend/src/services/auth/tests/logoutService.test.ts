import { describe, it, expect, vi, afterEach } from 'vitest';

import RefreshToken from '../../../models/refreshTokenSchema.js';
import { revokeRefreshToken } from '../logoutService.js';

vi.mock('../../../models/refreshTokenSchema.js', () => ({
  default: {
    deleteOne: vi.fn(),
  },
}));

describe('logoutService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('deletes the refresh token if token is provided', async () => {
    vi.mocked(RefreshToken.deleteOne).mockResolvedValue({} as never);

    await revokeRefreshToken('test-refresh-token');

    expect(RefreshToken.deleteOne).toHaveBeenCalledWith({
      token: 'test-refresh-token',
    });
  });

  it('does not call deleteOne if refresh token is missing', async () => {
    await revokeRefreshToken('');

    expect(RefreshToken.deleteOne).not.toHaveBeenCalled();
  });
});