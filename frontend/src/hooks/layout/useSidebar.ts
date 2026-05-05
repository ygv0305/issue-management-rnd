// Node modules
import { useState } from 'react';
import { useNavigate } from 'react-router';

// Context
import { useUser } from '../../lib/context/UserContext';

interface UseSidebarReturn {
  handleLogout: () => Promise<void>;
  isLoggingOut: boolean;
}

export const useSidebar = (): UseSidebarReturn => {
  const { logout } = useUser();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return {
    handleLogout,
    isLoggingOut,
  };
};
