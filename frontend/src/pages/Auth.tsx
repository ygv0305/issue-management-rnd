// Node modules
import { useState } from 'react';
import { useNavigate } from 'react-router';

export default function Auth() {
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email cannot be empty.');
      return;
    }

    if (authMode === 'login' && !password.trim()) {
      setError('Password cannot be empty.');
      return;
    }

    // Since there is no backend server yet, authenticate with any non-empty values
    if (authMode === 'login') {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/home');
    } else {
      alert('Check your email');
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

          <button type="submit" className="auth-submit">
            {authMode === 'login'
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
              onClick={() => setAuthMode('signup')}
              className="toggle-btn"
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('reset')}
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
                onClick={() => setAuthMode('login')}
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
