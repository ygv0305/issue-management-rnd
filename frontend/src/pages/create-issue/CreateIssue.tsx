// Node modules
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

// Services
import coreService from '../../services/coreService';

// Types
import type { IssueTypeData } from '../../types/issueTypes';

// Styles
import './createIssue.css';

export default function CreateIssue() {
  const navigate = useNavigate();
  const [issueTypes, setIssueTypes] = useState<IssueTypeData[]>([]);
  const [formData, setFormData] = useState({
    issueType: '',
    subject: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await coreService.getIssueTypes();
        if (res.success) {
          setIssueTypes(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch issue types:', error);
      }
    };
    fetchTypes();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await coreService.createIssue({
        subject: formData.subject,
        description: formData.description,
        type: formData.issueType,
      });
      alert('Issue Submitted Successfully!');
      navigate('/issues');
    } catch (error) {
      console.error('Failed to submit issue:', error);
      alert('Failed to submit issue. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-issue-container">
      <h2>Create New Issue</h2>

      <form onSubmit={handleSubmit} className="create-issue-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="issueType">
              Issue Type <span className="required">*</span>
            </label>
            <select
              id="issueType"
              name="issueType"
              value={formData.issueType}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">Select Type</option>
              {issueTypes.map((type) => (
                <option key={type._id} value={type._id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="subject">
              Subject <span className="required">*</span>
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="form-control"
              placeholder="Brief summary of the issue"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">
            Description <span className="required">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-control"
            placeholder="Detailed description of the issue..."
            required
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => window.history.back()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Issue'}
          </button>
        </div>
      </form>
    </div>
  );
}
