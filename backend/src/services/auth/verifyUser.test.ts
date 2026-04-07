import bcrypt from 'bcrypt';
import { describe, it, expect, vi, afterEach } from 'vitest';


import { verifyUser } from './requestLoginService.js';

import User from '../../models/userSchema.js';

vi.mock('bcrypt', () => ({
  default: {
    compare: vi.fn(),
  },
}));

vi.mock('../../models/userSchema.js', () => ({
  default: {
    findOne: vi.fn(),
  },
}));

describe('verifyUser', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

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
          exec: vi.fn().mockResolvedValue({ email: 'test@email.com' }),
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
            password: 'hashed',
          }),
        }),
      }),
    } as any);

    vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

    const result = await verifyUser('test@email.com', '123');

    expect(result).toBeNull();
  });

  it('returns user if password correct', async () => {
    const mockUser = {
      email: 'test@email.com',
      password: 'hashed',
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
  });
});