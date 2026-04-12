// Node modules
import { createBrowserRouter, Outlet } from 'react-router';

// Context
import { UserProvider } from './lib/context/UserContext';

// Pages
import Auth from './pages/auth/Auth';
import CreatePassword from './pages/auth/CreatePassword';
import MyIssueView from './pages/issue-view/MyIssueView';
import AllIssueView from './pages/issue-view/AllIssueView';
import CreateIssue from './pages/create-issue/CreateIssue';
import ProjectManage from './pages/project/ProjectManage';
import AccountManage from './pages/account-manage/AccountManage';

// RBAC
import { PERMISSIONS } from './lib/rbac/allPermission';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';

export const router = createBrowserRouter([
  {
    element: (
      <UserProvider>
        <Outlet />
      </UserProvider>
    ),
    children: [
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
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <Layout />,
            children: [
              {
                path: '/my-issues',
                element: <MyIssueView />,
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
                path: '/create-issue',
                element: <CreateIssue />,
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
