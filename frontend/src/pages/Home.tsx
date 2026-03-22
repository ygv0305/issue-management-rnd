// Node modules
import { useNavigate } from 'react-router';

// Services
import AuthService from '../services/authServices';

export default function Home() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      alert('Logout error');
      console.error('Logout error', error);
    } finally {
      localStorage.removeItem('accessToken');
      navigate('/');
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome to the Home Page</h1>
        <p>You have successfully logged in. This is a protected route.</p>
        <button onClick={handleLogout} className="logout-btn">
          Log Out
        </button>
      </div>
    </div>
  );
}
