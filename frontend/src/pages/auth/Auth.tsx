// Hooks
import { useAuth } from '../../hooks/auth/useAuth';

// Styles + Assets
import styles from './Auth.module.css';
import authBg from '../../assets/images/auth-bg.webp';
import autLogo from '../../assets/images/aut-logo.jpg';
import emailIcon from '../../assets/vectors/user.svg';
import passwordIcon from '../../assets/vectors/lock.svg';

export default function Auth() {
  const {
    authMode,
    email,
    password,
    error,
    isLoading,
    setEmail,
    setPassword,
    authModeChange,
    handleSubmit,
  } = useAuth();

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
