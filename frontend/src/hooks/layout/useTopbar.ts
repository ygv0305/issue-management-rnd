// Context
import { useUser } from '../../lib/context/UserContext';

interface UseTopbarReturn {
  userName: string;
  userInitials: string;
  handleNotificationClick: () => void;
  handleProfileClick: () => void;
}

export const useTopbar = (): UseTopbarReturn => {
  const { user } = useUser();

  const handleNotificationClick = () => {
    alert('You have 0 new notifications.');
  };

  const handleProfileClick = () => {
    alert(
      `My Profile\n\nName: ${user?.fullName || user?.email}\nRole: ${user?.role}`,
    );
  };

  const getUserInitials = (): string => {
    if (user?.fullName) {
      return user.fullName.charAt(0).toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  return {
    userName: user?.fullName || 'Profile',
    userInitials: getUserInitials(),
    handleNotificationClick,
    handleProfileClick,
  };
};
