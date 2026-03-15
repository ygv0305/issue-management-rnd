// Node modules
import { createBrowserRouter } from 'react-router';

// Pages
import Auth from './pages/Auth';
import Home from './pages/Home';

// Components
import ProtectedRoute from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Auth />,
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
