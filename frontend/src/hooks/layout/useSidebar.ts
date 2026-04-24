// Node modules
import { useNavigate } from 'react-router';

// Context
import { useUser } from '../../lib/context/UserContext';

interface UseSidebarReturn {
  handleLogout: () => Promise<void>;
}

export const useSidebar = (): UseSidebarReturn => {
  const { logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return {
    handleLogout,
  };
};
