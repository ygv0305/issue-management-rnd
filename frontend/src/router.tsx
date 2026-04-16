// Node modules
import { createBrowserRouter, Outlet } from 'react-router';

// Context
import { UserProvider } from './lib/context/UserContext';

// Pages
import Auth from './pages/auth/Auth';
import CreatePassword from './pages/auth/CreatePassword';
import MyIssueView from './pages/issue-view/MyIssueView';
import CreateIssue from './pages/create-issue/CreateIssue';
import AllIssueView from './pages/issue-view/AllIssueView';
import Dashboard from './pages/dashboard/Dashboard';
import ProjectManage from './pages/project/ProjectManage';
import AccountManage from './pages/account-manage/AccountManage';

// RBAC
import { PERMISSIONS } from './lib/rbac/allPermission';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import LayoutTemplate from './components/templates/LayoutTemplate';

export const router = createBrowserRouter([
  {
    element: (
      <UserProvider>
        <Outlet />
      </UserProvider>
    ),
    children: [
      // Auth routes
      {
        path: '/',
        element: <Auth />,
      },
      {
        path: '/create-password',
        element: <CreatePassword />,
      },
      {
        path: '/reset-password',
        element: <CreatePassword />,
      },
      // Main protected routes
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <LayoutTemplate />,
            children: [
              {
                path: '/my-issues',
                element: <MyIssueView />,
              },
              {
                path: '/create-issue',
                element: <CreateIssue />,
              },
              {
                element: (
                  <ProtectedRoute
                    requiredPermission={PERMISSIONS.VIEW_ALL_ISSUE}
                  />
                ),
                children: [
                  {
                    path: '/all-issues',
                    element: <AllIssueView />,
                  },
                ],
              },
              {
                element: (
                  <ProtectedRoute
                    requiredPermission={PERMISSIONS.VIEW_DASHBOARD}
                  />
                ),
                children: [
                  {
                    path: '/dashboard',
                    element: <Dashboard />,
                  },
                ],
              },
              {
                element: (
                  <ProtectedRoute
                    requiredPermission={PERMISSIONS.CREATE_PROJECT}
                  />
                ),
                children: [
                  {
                    path: '/project-manage',
                    element: <ProjectManage />,
                  },
                ],
              },
              {
                element: (
                  <ProtectedRoute
                    requiredPermission={PERMISSIONS.WHITELIST_USER}
                  />
                ),
                children: [
                  {
                    path: '/account-manage',
                    element: <AccountManage />,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);
