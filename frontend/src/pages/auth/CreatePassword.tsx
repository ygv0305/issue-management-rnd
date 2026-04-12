// Hooks
import { useCreatePassword } from '../../hooks/auth/useCreatePassword';

// Styles + Assets
import styles from './Auth.module.css';
import authBg from '../../assets/images/auth-bg.webp';
import autLogo from '../../assets/images/aut-logo.jpg';
import passwordIcon from '../../assets/vectors/lock.svg';

export default function CreatePassword() {
  const {
    email,
    token,
    password,
    confirmPassword,
    error,
    success,
    isLoading,
    isReset,
    setPassword,
    setConfirmPassword,
    handleSubmit,
  } = useCreatePassword();

  if (!token || !email) {
    return null;
  }

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
