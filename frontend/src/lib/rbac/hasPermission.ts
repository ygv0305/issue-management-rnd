// Types
import type { User } from '../../types/authTypes';

// RBAC
import { ROLE_PERMISSIONS } from './allPermission';

/**
 * Returns true if the given user holds the specified permission.
 * Returns false for null/undefined users or roles not present in ROLE_PERMISSIONS.
 *
 * @example
 * if (hasPermission(user, PERMISSIONS.VIEW_ALL_ISSUE)) { ... }
 */
export const hasPermission = (
  user: User | null | undefined,
  permission: string,
): boolean => {
  if (!user || !user.role) return false;

  const userPermissions =
    ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS] || [];
  return userPermissions.includes(permission);
};
