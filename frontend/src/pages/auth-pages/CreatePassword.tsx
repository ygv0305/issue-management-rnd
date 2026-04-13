// Node modules
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { AxiosError } from 'axios';

// Services
import AuthService from '../../services/authService';

// Styles + Assets
import styles from './Auth.module.css';
import authBg from '../../assets/images/auth-bg.webp';
import autLogo from '../../assets/images/aut-logo.jpg';
import passwordIcon from '../../assets/vectors/lock.svg';

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
      setTimeout(() => navigate('/'), 1000); // Give user time to see success message
    } catch (error: AxiosError) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'An unexpected error occurred';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token || !email) {
    return null;
  }

  // Determine if it looks like a reset or create flow based on URL path
  const isReset = window.location.pathname.includes('reset-password');

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
            {isReset ? 'Reset Your Password' : 'Create Your Password'}
          </h2>
          <p className={styles.authSubtitle}>
            Please enter a strong password for <strong>{email}</strong>
          </p>

          {error && <div className={styles.authError}>{error}</div>}
          {success && (
            <div
              className={styles.authError}
              style={{
                color: '#008000',
                border: '2px solid #008000',
              }}
            >
              Password set successfully! Redirecting...
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className={styles.authForm}>
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
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">
                  <img src={passwordIcon} alt="" />
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                />
              </div>

              <button type="submit" className="mainBtn" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
