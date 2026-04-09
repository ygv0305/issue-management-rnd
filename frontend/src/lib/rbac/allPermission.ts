/**
 * All system roles. Values must match the role strings returned by the backend.
 */
export const ROLES = {
  STUDENT: 'Student',
  SUPERVISOR: 'Supervisor',
  MODERATOR: 'Moderator',
  PAPERLEADER: 'PaperLeader',
  ADMIN: 'Admin',
  CLIENT: 'Client',
};

/**
 * All granular permissions used for route guards and conditional rendering.
 * Use these constants instead of raw strings to keep permission checks
 * in sync with ROLE_PERMISSIONS below.
 */
export const PERMISSIONS = {
  // BASE (accessible to all roles)
  CREATE_ISSUE: 'create:issue',
  VIEW_MY_ISSUE: 'view:ownIssue',

  // ADMIN
  WHITELIST_USER: 'whitelist:user',
  // VIEW_PROJECT: 'view:project',

  // PAPERLEADER
  VIEW_ALL_ISSUE: 'view:allIssue',
  CREATE_PROJECT: 'create:project',
  CREATE_ISSUETYPE: 'create:issueType',
  VIEW_ISSUETYPE: 'view:issueType',
  VIEW_PROJECT: 'view:project',
};

const BASE = [PERMISSIONS.CREATE_ISSUE, PERMISSIONS.VIEW_MY_ISSUE];

/**
 * Maps each role to the list of permissions it holds.
 * This is the single source of truth for authorization in the frontend.
 * Update here when backend roles or permissions change.
 */
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  [ROLES.STUDENT]: [...BASE],
  [ROLES.SUPERVISOR]: [...BASE],
  [ROLES.MODERATOR]: [...BASE],
  [ROLES.PAPERLEADER]: [
    ...BASE,
    PERMISSIONS.VIEW_ALL_ISSUE,
    PERMISSIONS.CREATE_PROJECT,
    PERMISSIONS.CREATE_ISSUETYPE,
    PERMISSIONS.VIEW_PROJECT,
    PERMISSIONS.VIEW_ISSUETYPE,
  ],
  [ROLES.ADMIN]: [
    ...BASE,
    PERMISSIONS.WHITELIST_USER,
    PERMISSIONS.VIEW_PROJECT,
  ],
  [ROLES.CLIENT]: [...BASE],
};
