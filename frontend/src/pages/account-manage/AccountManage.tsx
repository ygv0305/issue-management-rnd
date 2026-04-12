// Hooks
import { useAccountManage } from '../../hooks/account-manage/useAccountManage';

// RBAC
import withPermission from '../../lib/rbac/withPermission';
import { PERMISSIONS } from '../../lib/rbac/allPermission';

// Styles
import styles from './AccountManage.module.css';

function AccountManage() {
  const {
    formData,
    submitting,
    statusMessage,
    projects,
    loading,
    roles,
    handleChange,
    handleSubmit,
  } = useAccountManage();

  if (loading) {
    return <div className="createFormCont">Loading...</div>;
  }

  return (
    <div className="createFormCont">
      <h2>Whitelist New Account</h2>
      <p className={styles.subtitle}>Pre-approve users to IMS.</p>

      {statusMessage && (
        <div
          className={`${styles.alert} ${styles[`alert${statusMessage.type}`]}`}
        >
          {statusMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="createForm">
        <div className="formRow">
          <div className="formGroup">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="formControl"
              placeholder="John Doe"
              maxLength={50}
              required
            />
            <div className="charCount">
              {formData.fullName.length} / 50 characters
            </div>
          </div>

          <div className="formGroup">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="formControl"
              placeholder="user@autuni.ac.nz"
              maxLength={50}
              required
            />
            <div className="charCount">
              {formData.email.length} / 50 characters
            </div>
          </div>
        </div>

        <div className="formRow">
          <div className="formGroup">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="formControl"
              required
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {formData.role === 'Student' && (
            <div className={`formGroup ${styles.fadeIn}`}>
              <label htmlFor="projectId">Project</label>
              <select
                id="projectId"
                name="projectId"
                value={formData.projectId}
                onChange={handleChange}
                className="formControl"
                required={formData.role === 'Student'}
              >
                <option value="">Select a Project</option>
                {projects.map((proj) => (
                  <option key={proj._id} value={proj._id}>
                    {proj.name}
                  </option>
                ))}
              </select>
              <small className={styles.helpText}>
                Student must work in a project.
              </small>
            </div>
          )}
        </div>

        <div className="formActions">
          <button type="submit" className="mainBtn" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default withPermission(AccountManage, PERMISSIONS.WHITELIST_USER);
