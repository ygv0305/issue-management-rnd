// Node modules
import { createBrowserRouter } from 'react-router';

// Pages
import Auth from './pages/auth-pages/Auth';
import Home from './pages/Home';
import CreatePassword from './pages/auth-pages/CreatePassword';

// Components
import ProtectedRoute from './components/ProtectedRoute';

export const router = createBrowserRouter([
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
]);
