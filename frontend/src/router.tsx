// Node modules
import { createBrowserRouter } from 'react-router';

// Pages
import Auth from './pages/Auth';
import Home from './pages/Home';
import CreatePassword from './pages/CreatePassword';

// Components
//import ProtectedRoute from './components/ProtectedRoute';

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
    children: [
      {
        path: '/home',
        element: <Home />,
      },
    ],
  },
]);
