import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Types } from 'mongoose';

const mocks = vi.hoisted(() => {
  const execMock = vi.fn();
  const leanMock = vi.fn(() => ({ exec: execMock }));
  const populateAssignedToMock = vi.fn(() => ({ lean: leanMock }));
  const populateTypeMock = vi.fn(() => ({ populate: populateAssignedToMock }));
  const populateAuthorMock = vi.fn(() => ({ populate: populateTypeMock }));
  const findMock = vi.fn(() => ({ populate: populateAuthorMock }));

  return {
    execMock,
    leanMock,
    populateAssignedToMock,
    populateTypeMock,
    populateAuthorMock,
    findMock,
  };
});

vi.mock('../../../models/issueSchema.js', () => {
  return {
    default: {
      find: mocks.findMock,
    },
  };
});

import { fetchMyIssues } from '../getMyIssuesService';

describe('fetchMyIssues', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return issues where the user is author or assignedTo', async () => {
    const userId = new Types.ObjectId();

    const mockIssues = [
      {
        _id: new Types.ObjectId(),
        subject: 'Login bug',
        author: {
          _id: userId,
          fullName: 'Richard Sarfo',
          email: 'richard@example.com',
        },
        type: {
          _id: new Types.ObjectId(),
          name: 'Bug',
        },
        assignedTo: {
          _id: new Types.ObjectId(),
          fullName: 'Jack Doe',
          email: 'jack@example.com',
        },
      },
    ];

    mocks.execMock.mockResolvedValue(mockIssues);

    const result = await fetchMyIssues(userId);

    expect(mocks.findMock).toHaveBeenCalledWith({
      $or: [{ author: userId }, { assignedTo: userId }],
    });
    expect(mocks.populateAuthorMock).toHaveBeenCalledWith(
      'author',
      'fullName email',
    );
    expect(mocks.populateTypeMock).toHaveBeenCalledWith('type', 'name');
    expect(mocks.populateAssignedToMock).toHaveBeenCalledWith(
      'assignedTo',
      'fullName email',
    );
    expect(mocks.leanMock).toHaveBeenCalled();
    expect(mocks.execMock).toHaveBeenCalled();
    expect(result).toEqual(mockIssues);
  });

  it('should return empty array when no issues are found', async () => {
    const userId = 'user-123';
    mocks.execMock.mockResolvedValue([]);

    const result = await fetchMyIssues(userId);

    expect(result).toEqual([]);
  });

  it('should throw an error when query fails', async () => {
    const userId = 'user-123';
    mocks.execMock.mockRejectedValue(new Error('Database error'));

    await expect(fetchMyIssues(userId)).rejects.toThrow('Database error');
  });
});