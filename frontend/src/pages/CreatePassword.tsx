// Node modules
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

// Services
import AuthService from '../services/authServices';

export default function CreatePassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !email) {
      navigate('/');
    }
  }, [token, email, navigate]);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setError('');
    setIsLoading(true);

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    try {
      if (!email || !token) throw new Error('Missing email or token.');
      await AuthService.setPassword({ email, token, password });

      setSuccess(true);
      setTimeout(() => navigate('/'), 2000); // Give user time to see success message
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'An error occurred while setting the password.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token || !email) {
    return null;
  }

  // Determine if it looks like a reset or create flow based on URL path, but the backend handles it generically.
  const isReset = window.location.pathname.includes('reset-password');

  return (
    <div className="auth-container">
      <h2 className="auth-intro">Issue Management and Tracking System</h2>
      <div className="auth-card">
        <h2 className="auth-title">
          {isReset ? 'Reset Your Password' : 'Create Your Password'}
        </h2>
        <p className="auth-subtitle">
          Please enter a strong password for <strong>{email}</strong>
        </p>

        {error && <div className="auth-error">{error}</div>}
        {success && (
          <div
            className="auth-error"
            style={{
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              color: '#4caf50',
              border: '1px solid #4caf50',
            }}
          >
            Password set successfully! Redirecting...
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="password">N</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">C</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="auth-submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
