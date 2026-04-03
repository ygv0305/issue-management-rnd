// Node modules
import { createBrowserRouter, Outlet } from 'react-router';

// Context
import { UserProvider } from './lib/context/UserContext';

// Pages
import Auth from './pages/auth-pages/Auth';
import CreatePassword from './pages/auth-pages/CreatePassword';
import MyIssueView from './pages/issue-view/MyIssueView';
import AllIssueView from './pages/issue-view/AllIssueView';
import CreateIssue from './pages/create-issue/CreateIssue';
import Project from './pages/project/Project';
import AccountManage from './pages/account-manage/AccountManage';

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
                path: '/all-issues',
                element: <AllIssueView />,
              },
              {
                path: '/create-issue',
                element: <CreateIssue />,
              },
              {
                path: '/projects',
                element: <Project />,
              },
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
]);
