# Issue Management — Frontend

React + TypeScript single-page application for the Issue Management system.

## Tech Stack

| Tool         | Version | Purpose                       |
| ------------ | ------- | ----------------------------- |
| React        | 19      | UI framework                  |
| TypeScript   | 5       | Type safety                   |
| Vite         | 7       | Dev server & bundler          |
| React Router | 7       | Client-side routing           |
| Axios        | 1       | HTTP client with interceptors |

## Getting Started

```bash
npm install
npm run dev       # Dev server on http://localhost:5173
```

The backend must be running on `http://localhost:3000` before starting the frontend.

## Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Type-check + build to dist/
npm run preview   # Preview production build
npm run lint      # Run ESLint
npm run format    # Format code with Prettier
```

## Project Structure

```
src/
├── main.tsx                  # App entry point
├── router.tsx                # Route definitions
├── index.css                 # Global styles
│
├── assets/                   # Static images and icons
│
├── components/
│   ├── ProtectedRoute.tsx    # Auth + RBAC route guard
│   ├── layout/               # App shell (Layout, Sidebar, Topbar)
│   └── issue-modal/          # Issue detail modal (Overview, Discussion, Actions tabs)
│
├── hooks/
│   └── useSyncGlobalData.ts  # Syncs issue types & projects to localStorage on login
│
├── lib/
│   ├── api/
│   │   ├── axios.ts          # Plain axios instance (unauthenticated requests)
│   │   └── axiosAuth.ts      # Axios instance with JWT injection + auto token refresh
│   ├── context/
│   │   └── UserContext.tsx   # Global user state (auth, auto-login, logout)
│   └── rbac/
│       ├── allPermission.ts  # Role & permission constants, ROLE_PERMISSIONS map
│       ├── hasPermission.ts  # Utility: check if a user holds a permission
│       └── withPermission.tsx # HOC: render a component only if permission is met
│
├── pages/
│   ├── auth-pages/           # Login / register / forgot password / set password
│   ├── issue-view/           # MyIssueView (all users), AllIssueView (PaperLeader)
│   ├── create-issue/         # New issue form
│   ├── project/              # Project & issue type management (PaperLeader)
│   └── account-manage/       # User whitelisting (Admin)
│
├── services/                 # API client functions grouped by domain
│   ├── authService.ts        # /auth/* endpoints
│   ├── coreService.ts        # /core-base/* endpoints (issues, comments, issue types)
│   ├── pLeaderService.ts     # /p-leader/* endpoints (all issues, projects)
│   └── adminService.ts       # /admin/* endpoints (whitelist user)
│
└── types/
    ├── authTypes.ts          # User, SystemRoles, auth request/response types
    ├── issueTypes.ts         # IssueData, CommentData, IssueStatus, IssuePriority
    └── projectTypes.ts       # ProjectData
```

## Routes

| Path               | Component      | Access                         |
| ------------------ | -------------- | ------------------------------ |
| `/`                | Auth           | Public                         |
| `/create-password` | CreatePassword | Public (token via query param) |
| `/reset-password`  | CreatePassword | Public (token via query param) |
| `/my-issues`       | MyIssueView    | All authenticated users        |
| `/create-issue`    | CreateIssue    | All authenticated users        |
| `/all-issues`      | AllIssueView   | PaperLeader only               |
| `/project-manage`  | ProjectManage  | PaperLeader only               |
| `/account-manage`  | AccountManage  | Admin only                     |

Unauthenticated users are redirected to `/`. Authenticated users without the required permission are redirected to `/my-issues`.

## Role-Based Access Control (RBAC)

Permissions are assigned per role in `lib/rbac/allPermission.ts`.

| Role                                   | Permissions                                      |
| -------------------------------------- | ------------------------------------------------ |
| Student, Supervisor, Moderator, Client | Create issue, View own issues                    |
| PaperLeader                            | + View all issues, Manage projects & issue types |
| Admin                                  | + Whitelist users, View projects                 |

**Three enforcement layers:**

1. `ProtectedRoute` — route-level guard in the router
2. `withPermission(Component, permission)` — HOC that returns `null` if the user lacks the permission
3. `hasPermission(user, permission)` — plain utility for conditional logic inside components

## Authentication Flow

- JWT access token stored in `localStorage` (`accessToken`)
- Refresh token stored in an HTTP-only cookie (sent automatically via `withCredentials: true`)
- On app load, `UserContext` calls `authService.autoLogin()` to restore the session
- `axiosAuth` automatically attaches the access token to every request
- On 401 responses, `axiosAuth` calls `/auth/renew-token` to get a new access token, then retries the original request — concurrent requests during a refresh are queued to avoid race conditions
- On refresh failure the user is logged out and redirected to `/`

## State Management

| Concern            | Mechanism                                                               |
| ------------------ | ----------------------------------------------------------------------- |
| Authenticated user | `UserContext` (React Context)                                           |
| Issue types        | `localStorage` (`issueTypes`) — synced on login via `useSyncGlobalData` |
| Projects           | `localStorage` (`projects`) — synced on login for Admin & PaperLeader   |
| Page/form state    | Local `useState` inside each page component                             |
