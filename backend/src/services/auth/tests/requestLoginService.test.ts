import bcrypt from 'bcrypt';
import { describe, it, expect, vi, afterEach } from 'vitest';

import User from '../../../models/userSchema.js';
import RefreshToken from '../../../models/refreshTokenSchema.js';
import { genAccessToken, genRefreshToken } from '../../../lib/jwt.js';
import { verifyUser, createSession } from '../requestLoginService.js';

vi.mock('bcrypt', () => ({
  default: {
    compare: vi.fn(),
  },
}));

vi.mock('../../../models/userSchema.js', () => ({
  default: {
    findOne: vi.fn(),
  },
}));

vi.mock('../../../models/refreshTokenSchema.js', () => ({
  default: {
    create: vi.fn(),
  },
}));

vi.mock('../../../lib/jwt.js', () => ({
  genAccessToken: vi.fn(),
  genRefreshToken: vi.fn(),
}));

describe('requestLoginService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('verifyUser', () => {
    it('returns null if user not found', async () => {
      vi.mocked(User.findOne).mockReturnValue({
        select: vi.fn().mockReturnValue({
          lean: vi.fn().mockReturnValue({
            exec: vi.fn().mockResolvedValue(null),
          }),
        }),
      } as any);

      const result = await verifyUser('test@email.com', '123');

      expect(result).toBeNull();
    });

    it('returns null if password missing', async () => {
      vi.mocked(User.findOne).mockReturnValue({
        select: vi.fn().mockReturnValue({
          lean: vi.fn().mockReturnValue({
            exec: vi.fn().mockResolvedValue({
              email: 'test@email.com',
            }),
          }),
        }),
      } as any);

      const result = await verifyUser('test@email.com', '123');

      expect(result).toBeNull();
    });

    it('returns null if password incorrect', async () => {
      vi.mocked(User.findOne).mockReturnValue({
        select: vi.fn().mockReturnValue({
          lean: vi.fn().mockReturnValue({
            exec: vi.fn().mockResolvedValue({
              email: 'test@email.com',
              password: 'hashed-password',
            }),
          }),
        }),
      } as any);

      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

      const result = await verifyUser('test@email.com', '123');

      expect(result).toBeNull();
      expect(bcrypt.compare).toHaveBeenCalledWith('123', 'hashed-password');
    });

    it('returns user if password correct', async () => {
      const mockUser = {
        email: 'test@email.com',
        password: 'hashed-password',
      };

      vi.mocked(User.findOne).mockReturnValue({
        select: vi.fn().mockReturnValue({
          lean: vi.fn().mockReturnValue({
            exec: vi.fn().mockResolvedValue(mockUser),
          }),
        }),
      } as any);

      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

      const result = await verifyUser('test@email.com', '123');

      expect(result).toEqual(mockUser);
      expect(bcrypt.compare).toHaveBeenCalledWith('123', 'hashed-password');
    });
  });

  describe('createSession', () => {
    it('creates refresh token record and returns access and refresh tokens', async () => {
      vi.mocked(genAccessToken).mockReturnValue('mock-access-token');
      vi.mocked(genRefreshToken).mockReturnValue('mock-refresh-token');
      vi.mocked(RefreshToken.create).mockResolvedValue({} as never);

      const userId = 'user-123';

      const result = await createSession(userId);

      expect(genAccessToken).toHaveBeenCalledWith(userId);
      expect(genRefreshToken).toHaveBeenCalledWith(userId);
      expect(RefreshToken.create).toHaveBeenCalledOnce();

      expect(RefreshToken.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId,
          token: 'mock-refresh-token',
          expiresAt: expect.any(Date),
        })
      );

      expect(result).toEqual({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      });
    });
  });
});