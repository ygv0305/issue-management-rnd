import { describe, it, expect, vi, afterEach } from 'vitest';

import User from '../../../models/userSchema.js';
import VerificationToken from '../../../models/verificationTokenSchema.js';

import {
  verifyToken,
  createAdmin,
  updatePassword,
  deleteToken,
} from '../setPasswordService.js';

vi.mock('../../../models/userSchema.js', () => ({
  default: {
    create: vi.fn(),
    findOne: vi.fn(),
  },
}));

vi.mock('../../../models/verificationTokenSchema.js', () => ({
  default: {
    findOne: vi.fn(),
    deleteOne: vi.fn(),
  },
}));

describe('resetPasswordService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns token if found', async () => {
    const mockToken = { email: 'test@mail.com', token: '123' };

    vi.mocked(VerificationToken.findOne).mockReturnValue({
      lean: vi.fn().mockReturnValue({
        exec: vi.fn().mockResolvedValue(mockToken),
      }),
    } as any);

    const result = await verifyToken('test@mail.com', '123');

    expect(result).toEqual(mockToken);
  });

  it('creates admin user', async () => {
    const mockUser = { email: 'admin@mail.com', role: 'Admin' };

    vi.mocked(User.create).mockResolvedValue(mockUser as never);

    const result = await createAdmin('admin@mail.com', 'password');

    expect(User.create).toHaveBeenCalledWith({
      email: 'admin@mail.com',
      password: 'password',
      role: 'Admin',
    });

    expect(result).toEqual(mockUser);
  });

  it('returns null if user not found', async () => {
    vi.mocked(User.findOne).mockReturnValue({
      exec: vi.fn().mockResolvedValue(null),
    } as any);

    const result = await updatePassword('test@mail.com', 'newpass');

    expect(result).toBeNull();
  });

  it('updates password if user exists', async () => {
    const saveMock = vi.fn().mockResolvedValue(undefined);

    const mockUser = {
      email: 'test@mail.com',
      password: 'old',
      save: saveMock,
    };

    vi.mocked(User.findOne).mockReturnValue({
      exec: vi.fn().mockResolvedValue(mockUser),
    } as any);

    const result = await updatePassword('test@mail.com', 'newpass');

    expect(mockUser.password).toBe('newpass');
    expect(saveMock).toHaveBeenCalled();
    expect(result).toEqual(mockUser);
  });

  it('deletes verification token', async () => {
    vi.mocked(VerificationToken.deleteOne).mockResolvedValue({} as never);

    await deleteToken('token-id');

    expect(VerificationToken.deleteOne).toHaveBeenCalledWith({
      _id: 'token-id',
    });
  });
});