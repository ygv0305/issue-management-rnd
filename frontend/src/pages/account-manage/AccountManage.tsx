// Node modules
import React, { useEffect, useState } from 'react';
import type { AxiosError } from 'axios';

type WhitelistErrorResponse = {
  message?: string;
};

// Services
import adminService from '../../services/adminService';

// RBAC
import withPermission from '../../lib/rbac/withPermission';
import { PERMISSIONS } from '../../lib/rbac/allPermission';

// Types
import type { SystemRoles, WhitelistUserData } from '../../types/authTypes';
import type { ProjectData } from '../../types/projectTypes';

// Styles
import styles from './AccountManage.module.css';

function AccountManage() {
  const [formData, setFormData] = useState<WhitelistUserData>({
    email: '',
    role: 'Student' as SystemRoles,
    fullName: '',
    projectId: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'Success' | 'Error';
    text: string;
  } | null>(null);

  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem('projects')!);
      if (parsed) {
        setProjects(parsed);
      }
    } catch (error) {
      console.error('Error reading projects, ', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const roles: SystemRoles[] = [
    'Student',
    'Supervisor',
    'Moderator',
    'PaperLeader',
    'Admin',
    'Client',
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!formData.email.endsWith('@autuni.ac.nz')) {
      setStatusMessage({
        type: 'Error',
        text: 'Email must be a valid @autuni.ac.nz address.',
      });
      return;
    }

    if (formData.role === 'Student' && !formData.projectId) {
      setStatusMessage({
        type: 'Error',
        text: 'Student must work in a project. Please provide a Project ID.',
      });
      return;
    }

    setSubmitting(true);
    try {
      const dataToSubmit = { ...formData };
      if (dataToSubmit.role !== 'Student') {
        delete dataToSubmit.projectId;
      }

      const res = await adminService.whitelistUser(dataToSubmit);
      if (res.success) {
        setStatusMessage({
          type: 'Success',
          text: 'User successfully whitelisted!',
        });
        setFormData({
          email: '',
          role: 'Student' as SystemRoles,
          fullName: '',
          projectId: '',
        });
      } else {
        setStatusMessage({
          type: 'Error',
          text: res.message || 'Failed to whitelist user.',
        });
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<WhitelistErrorResponse>;
      console.error('Error whitelisting user:', axiosError);
      const errorMsg =
        axiosError.response?.data?.message ||
        'Failed to whitelist user. Please try again.';
      setStatusMessage({ type: 'Error', text: errorMsg });
    } finally {
      setSubmitting(false);
    }
  };

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

const AccountManageWithPermission = withPermission(AccountManage, PERMISSIONS.WHITELIST_USER);

export default AccountManageWithPermission;
