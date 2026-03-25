// Node modules
import React, { useState } from 'react';

// Styles
import './createIssue.css';

export default function CreateIssue() {
  const [formData, setFormData] = useState({
    issueType: '',
    subject: '',
    impactLevel: '',
    urgencyLevel: '',
    description: '',
    tags: '',
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Mock Issue Submitted Successfully!');
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
              <option value="Bug">Bug</option>
              <option value="Feature">Feature</option>
              <option value="Enhancement">Enhancement</option>
              <option value="Task">Task</option>
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

        <div className="form-row">
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
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

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
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
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

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="form-control"
              placeholder="Comma separated user tags e.g. @sahara"
            />
          </div>

          <div className="form-group">
            <label htmlFor="attachments">Attachments</label>
            <input
              type="file"
              id="attachments"
              name="attachments"
              className="form-control"
              multiple
            />
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
          <button type="submit" className="btn btn-primary">
            Submit Issue
          </button>
        </div>
      </form>
    </div>
  );
}
