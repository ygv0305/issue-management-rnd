// Node modules
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

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
      const res = await fetch('http://localhost:3000/api/auth/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to set password');
      }

      setSuccess(true);
      navigate('/');
    } catch (error: any) {
      setError(
        error.message || 'An error occurred while setting the password.',
      );
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
