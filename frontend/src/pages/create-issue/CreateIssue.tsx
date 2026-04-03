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
    urgencyLevel: '',
    impactLevel: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem('issueTypes')!);
      if (parsed) {
        setIssueTypes(parsed);
      }
    } catch (error) {
      console.error('Error reading issue types, ', error);
      setIssueTypes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div className="issue-view-container">Loading ...</div>;
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resolvePriority = (urgency: string, impact: string) => {
    if (urgency === 'Low') {
      if (impact === 'Low' || impact === 'Medium') return 'Low';
      if (impact === 'High') return 'Medium';
    }
    if (urgency === 'Medium') {
      if (impact === 'Low') return 'Low';
      if (impact === 'Medium') return 'Medium';
      if (impact === 'High') return 'High';
    }
    if (urgency === 'High') {
      if (impact === 'Low') return 'Medium';
      if (impact === 'Medium') return 'High';
      if (impact === 'High') return 'Critical';
    }
    return '';
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!formData.urgencyLevel || !formData.impactLevel) {
      alert('Please select both Urgency Level and Impact Level.');
      return;
    }

    // Field validation
    if (formData.subject.length > 50) {
      alert('Subject cannot exceed 50 characters.');
      return;
    }
    if (formData.description.length > 1000) {
      alert('Description cannot exceed 1000 characters.');
      return;
    }

    setSubmitting(true);
    try {
      const priority = resolvePriority(
        formData.urgencyLevel,
        formData.impactLevel,
      );
      await coreService.createIssue({
        subject: formData.subject,
        description: formData.description,
        type: formData.issueType,
        priority: priority,
      });
      alert('Issue submitted successfully!');
      navigate('/my-issues');
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
              maxLength={50}
              required
            />
            <div className="char-count">
              {formData.subject.length} / 50 characters
            </div>
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
            maxLength={1000}
            required
          />
          <div className="char-count">
            {formData.description.length} / 1000 characters
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="urgencyLevel">
              Urgency Level <span className="required">*</span>
            </label>
            <select
              id="urgencyLevel"
              name="urgencyLevel"
              value={formData.urgencyLevel}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">Select Urgency</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="impactLevel">
              Impact Level <span className="required">*</span>
            </label>
            <select
              id="impactLevel"
              name="impactLevel"
              value={formData.impactLevel}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">Select Impact</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
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
