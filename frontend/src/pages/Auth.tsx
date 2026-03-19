// Node modules
import { useState } from 'react';
import { useNavigate } from 'react-router';

type AuthMode = 'login' | 'signup' | 'reset';

export default function Auth() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const authModeChange = (mode: AuthMode) => {
    setAuthMode(mode);
    setError('');
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setError('');
    setIsLoading(true);

    if (!email.trim()) {
      setError('Email cannot be empty.');
      setIsLoading(false);
      return;
    }

    if (authMode === 'login' && !password.trim()) {
      setError('Password cannot be empty.');
      setIsLoading(false);
      return;
    }

    if (!email.endsWith('@autuni.ac.nz')) {
      setError('You must use a valid @autuni.ac.nz address.');
      setIsLoading(false);
      return;
    }

    if (authMode === 'login' && password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setIsLoading(false);
      return;
    }

    try {
      if (authMode === 'login') {
        const res = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
          credentials: 'include',
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed');

        localStorage.setItem('accessToken', data.accessToken);
        navigate('/home');
      } else if (authMode === 'signup') {
        const res = await fetch('http://localhost:3000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Registration failed');
        alert(data.message || 'Check your email for the verification link.');
        authModeChange('login'); // Switch back to login page
      } else if (authMode === 'reset') {
        const res = await fetch(
          'http://localhost:3000/api/auth/forgot-password',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          },
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Password reset failed');
        alert(
          data.message ||
            'If an account exists, a reset link has been sent to your email.',
        );
        authModeChange('login');
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-intro">Issue Management and Tracking System</h2>
      <div className="auth-card">
        <h2 className="auth-title">
          {authMode === 'login'
            ? 'Welcome Back'
            : authMode === 'signup'
              ? 'Create Account'
              : 'Forgot Password'}
        </h2>
        {authMode !== 'login' && (
          <p className="auth-subtitle">
            Enter your email to request a link to{' '}
            {authMode === 'signup'
              ? 'create an account'
              : 'reset your password'}
          </p>
        )}

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">E</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
          </div>

          {authMode === 'login' && (
            <div className="form-group">
              <label htmlFor="password">P</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          )}

          <button type="submit" className="auth-submit" disabled={isLoading}>
            {isLoading
              ? 'Processing...'
              : authMode === 'login'
                ? 'Log In'
                : authMode === 'signup'
                  ? 'Sign Up'
                  : 'Send'}
          </button>
        </form>

        {authMode === 'login' ? (
          <div className="auth-toggle-login">
            <button
              type="button"
              onClick={() => authModeChange('signup')}
              className="toggle-btn"
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={() => authModeChange('reset')}
              className="toggle-btn"
            >
              Forgot Password?
            </button>
          </div>
        ) : (
          <div className="auth-toggle-signup">
            <p>
              {authMode === 'signup' ? 'Already have an account?' : 'Back to'}{' '}
              <button
                type="button"
                onClick={() => authModeChange('login')}
                className="toggle-btn"
              >
                Log in
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
