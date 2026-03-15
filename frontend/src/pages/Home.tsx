// Node modules
import { useNavigate } from 'react-router';

export default function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
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
