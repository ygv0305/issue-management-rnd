// Node modules
import { useNavigate } from 'react-router';

// Custom modules
import apiAuth from '../lib/axiosAuth';

export default function Home() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiAuth.post('/auth/logout');
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
