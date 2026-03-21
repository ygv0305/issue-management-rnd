// Node modules
import { createBrowserRouter, Outlet } from 'react-router';

// Context
import { UserProvider } from './lib/context/UserContext';

// Pages
import Auth from './pages/auth-pages/Auth';
import Home from './pages/home/Home';
import CreatePassword from './pages/auth-pages/CreatePassword';

// Components
import ProtectedRoute from './components/ProtectedRoute';

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
            path: '/home',
            element: <Home />,
          },
        ],
      },
    ],
  },
]);
