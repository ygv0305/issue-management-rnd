// Node modules
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

// Services
import AuthService from '../../services/authService';

// Context
import { useUser } from '../../lib/context/UserContext';

// CSS + Assets
import './auth.css';
import authBg from '../../assets/images/auth-bg.webp';
import autLogo from '../../assets/images/aut-logo.jpg';
import emailIcon from '../../assets/vectors/user.svg';
import passwordIcon from '../../assets/vectors/lock.svg';

type AuthMode = 'login' | 'signup' | 'reset';

export default function Auth() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, loading: userLoading, checkAuth } = useUser();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (!userLoading && user) {
      navigate('/my-issues');
    }
  }, [user, userLoading, navigate]);

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
        const data = await AuthService.requestLogin({ email, password });
        localStorage.setItem('accessToken', data.accessToken!);
        await checkAuth();
      } else if (authMode === 'signup') {
        const data = await AuthService.register({ email });
        alert(data.message || 'Check your email for the verification link.');
        authModeChange('login'); // Switch back to login page
      } else if (authMode === 'reset') {
        const data = await AuthService.forgotPassword({ email });
        alert(
          data.message ||
            'If an account exists, a reset link has been sent to your email.',
        );
        authModeChange('login');
      }
    } catch (error: any) {
      if (
        authMode === 'signup' &&
        error.response?.data?.code === 'UserNotFound'
      ) {
        alert(
          'You are not authorised for this course. Contact your paper leader if you think it is a mistake.',
        );
      } else {
        const message =
          error.response?.data?.message ||
          error.message ||
          'An unexpected error occurred';
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <img className="bg-img" src={authBg} alt="" />
      <div className="bg-layer"></div>
      <div className="auth-main">
        <img className="aut-logo" src={autLogo} alt="" />
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
            <div className="form-group-auth">
              <label htmlFor="email">
                <img src={emailIcon} alt="" />
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="abc1234@autuni.ac.nz"
                required
              />
            </div>

            {authMode === 'login' && (
              <div className="form-group-auth">
                <label htmlFor="password">
                  <img src={passwordIcon} alt="" />
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
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
    </div>
  );
}
