export const ROLES = {
  STUDENT: 'Student',
  SUPERVISOR: 'Supervisor',
  MODERATOR: 'Moderator',
  PAPERLEADER: 'PaperLeader',
  ADMIN: 'Admin',
  CLIENT: 'Client',
};

export const PERMISSIONS = {
  // BASE (accessible to all roles)
  CREATE_ISSUE: 'create:issue',
  VIEW_MY_ISSUE: 'view:ownIssue',

  // ADMIN
  VIEW_PENDING_USER: 'view:pendingUser',
  APPROVE_USER: 'approve:user',

  // PAPERLEADER
  VIEW_ALL_ISSUE: 'view:allIssue',
  CREATE_PROJECT: 'create:project',
  CREATE_ISSUETYPE: 'create:issueType',
  VIEW_ISSUETYPE: 'view:issueType',
  VIEW_PROJECT: 'view:project',
};

const BASE = [PERMISSIONS.CREATE_ISSUE, PERMISSIONS.VIEW_MY_ISSUE];

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
    PERMISSIONS.VIEW_PENDING_USER,
    PERMISSIONS.APPROVE_USER,
  ],
  [ROLES.CLIENT]: [...BASE],
};
