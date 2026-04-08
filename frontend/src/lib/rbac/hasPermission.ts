// Types
import type { User } from '../../types/authTypes';

// RBAC
import { ROLE_PERMISSIONS } from './allPermission';

export const hasPermission = (
  user: User | null | undefined,
  permission: string,
): boolean => {
  if (!user || !user.role) return false;

  const userPermissions =
    ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS] || [];
  return userPermissions.includes(permission);
};
