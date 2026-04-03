// Node modules
import React, { useState, useEffect } from 'react';

// Services
import adminService from '../../services/adminService';

// RBAC
import withPermission from '../../lib/rbac/withPermission';
import { PERMISSIONS } from '../../lib/rbac/allPermission';

// Types
import type {
  SystemRoles,
  ProjectData,
  WhitelistUserData,
} from '../../types/authTypes';

// Fetching projects
import pLeaderService from '../../services/pLeaderService';

// CSS
import './accountManage.css';

function AccountManage() {
  const [formData, setFormData] = useState<WhitelistUserData>({
    email: '',
    role: 'Student' as SystemRoles,
    fullName: '',
    projectId: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [projects, setProjects] = useState<ProjectData[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await pLeaderService.getProjects();
        if (res.success) {
          setProjects(res.projects);
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };
    fetchProjects();
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
        type: 'error',
        text: 'Email must be a valid @autuni.ac.nz address.',
      });
      return;
    }

    if (formData.role === 'Student' && !formData.projectId) {
      setStatusMessage({
        type: 'error',
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
          type: 'success',
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
          type: 'error',
          text: res.message || 'Failed to whitelist user.',
        });
      }
    } catch (error: any) {
      console.error('Error whitelisting user:', error);
      const errorMsg =
        error.response?.data?.message ||
        'Failed to whitelist user. Please try again.';
      setStatusMessage({ type: 'error', text: errorMsg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="account-manage-container">
      <h2>Whitelist New Account</h2>
      <p className="subtitle">Pre-approve users to join the platform.</p>

      {statusMessage && (
        <div className={`alert alert-${statusMessage.type}`}>
          {statusMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="account-manage-form">
        <div className="form-group">
          <label htmlFor="fullName">
            Full Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="form-control"
            placeholder="John Doe"
            maxLength={50}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group flex-1">
            <label htmlFor="email">
              Email Address <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="user@autuni.ac.nz"
              maxLength={50}
              required
            />
          </div>

          <div className="form-group flex-1">
            <label htmlFor="role">
              Role <span className="required">*</span>
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-control"
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
        </div>

        {formData.role === 'Student' && (
          <div className="form-group fade-in">
            <label htmlFor="projectId">
              Project <span className="required">*</span>
            </label>
            <select
              id="projectId"
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              className="form-control"
              required={formData.role === 'Student'}
            >
              <option value="">Select a Project</option>
              {projects.map((proj) => (
                <option key={proj._id} value={proj._id}>
                  {proj.name}
                </option>
              ))}
            </select>
            <small className="help-text">
              Assigned project is mandatory for students.
            </small>
          </div>
        )}

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={submitting}
          >
            {submitting ? 'Whitelisting...' : 'Whitelist User'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default withPermission(AccountManage, PERMISSIONS.WHITELIST_USER);
