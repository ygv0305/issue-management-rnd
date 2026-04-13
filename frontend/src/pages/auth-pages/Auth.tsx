// Node modules
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import type { AxiosError } from 'axios';

// Services
import AuthService from '../../services/authService';

// Context
import { useUser } from '../../lib/context/UserContext';

// Styles + Assets
import styles from './Auth.module.css';
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
        const res = await AuthService.requestLogin({ email, password });
        localStorage.setItem('accessToken', res.accessToken!);
        await checkAuth();
      } else if (authMode === 'signup') {
        const res = await AuthService.register({ email });
        alert(res.message || 'Check your email for the verification link.');
        authModeChange('login'); // Switch back to login page
      } else if (authMode === 'reset') {
        const res = await AuthService.forgotPassword({ email });
        alert(res.message || 'A reset link has been sent to your email.');
        authModeChange('login');
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string; code?: string }>;
      if (
        authMode === 'signup' &&
        axiosError.response?.data?.code === 'UserNotFound'
      ) {
        alert(
          'You are not authorised for this course. Contact your paper leader if you think it is a mistake.',
        );
      } else {
        const message =
          axiosError.response?.data?.message ||
          axiosError.message ||
          'An unexpected error occurred';
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <img className={styles.bgImg} src={authBg} alt="" />
      <div className={styles.authMain}>
        <img className={styles.autLogo} src={autLogo} alt="" />
        <h2 className={styles.authIntro}>
          Issue Management and Tracking System
        </h2>
        <div className={styles.authCard}>
          <h2 className={styles.authTitle}>
            {authMode === 'login'
              ? 'Welcome Back'
              : authMode === 'signup'
                ? 'Create Account'
                : 'Forgot Password'}
          </h2>
          {authMode !== 'login' && (
            <p className={styles.authSubtitle}>
              Enter your email to request a link to{' '}
              {authMode === 'signup'
                ? 'create an account'
                : 'reset your password'}
            </p>
          )}

          {error && <div className={styles.authError}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.authForm}>
            <div className={styles.formGroup}>
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
              <div className={styles.formGroup}>
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

            <button type="submit" className="mainBtn" disabled={isLoading}>
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
            <div className={styles.toggleLogin}>
              <button
                type="button"
                onClick={() => authModeChange('signup')}
                className={styles.toggleBtn}
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => authModeChange('reset')}
                className={styles.toggleBtn}
              >
                Forgot Password?
              </button>
            </div>
          ) : (
            <div className={styles.toggleSignup}>
              <p>
                {authMode === 'signup' ? 'Already have an account?' : 'Back to'}{' '}
                <button
                  type="button"
                  onClick={() => authModeChange('login')}
                  className={styles.toggleBtn}
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
