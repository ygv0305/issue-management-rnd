import { describe, it, expect, vi, beforeEach } from 'vitest';

const mocks = vi.hoisted(() => {
  const execMock = vi.fn();
  const leanMock = vi.fn(() => ({ exec: execMock }));
  const findMock = vi.fn(() => ({ lean: leanMock }));

  return {
    execMock,
    leanMock,
    findMock,
  };
});

vi.mock('../../../models/issueTypeSchema.js', () => {
  return {
    default: {
      find: mocks.findMock,
    },
  };
});

import { fetchAllIssueTypes } from '../getIssueTypesService';

describe('fetchAllIssueTypes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return all issue types', async () => {
    const mockTypes = [
      { _id: '1', name: 'Bug' },
      { _id: '2', name: 'Feature Request' },
      { _id: '3', name: 'UI Issue' },
    ];

    mocks.execMock.mockResolvedValue(mockTypes);

    const result = await fetchAllIssueTypes();

    expect(mocks.findMock).toHaveBeenCalledWith({});
    expect(mocks.leanMock).toHaveBeenCalled();
    expect(mocks.execMock).toHaveBeenCalled();
    expect(result).toEqual(mockTypes);
  });

  it('should return empty array if no issue types exist', async () => {
    mocks.execMock.mockResolvedValue([]);

    const result = await fetchAllIssueTypes();

    expect(result).toEqual([]);
  });

  it('should throw an error if database query fails', async () => {
    mocks.execMock.mockRejectedValue(new Error('Database error'));

    await expect(fetchAllIssueTypes()).rejects.toThrow('Database error');
  });
});