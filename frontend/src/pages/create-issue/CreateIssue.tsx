// Hooks
import { useCreateIssue } from '../../hooks/issue/useCreateIssue';

// Styles
import styles from './CreateIssue.module.css';

export default function CreateIssue() {
  const {
    issueTypes,
    formData,
    submitting,
    loading,
    selectedUsers,
    loadOptions,
    AsyncSelectComponent,
    handleUserChange,
    handleChange,
    handleSubmit,
  } = useCreateIssue();

  if (loading) {
    return <div className="createFormCont">Loading...</div>;
  }

  return (
    <div className="createFormCont">
      <h2>Create New Issue</h2>

      <form onSubmit={handleSubmit} className="createForm">
        <div className="formRow">
          <div className="formGroup">
            <label htmlFor="issueType">Issue Type</label>
            <select
              id="issueType"
              name="issueType"
              value={formData.issueType}
              onChange={handleChange}
              className="formControl"
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

          <div className="formGroup">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="formControl"
              placeholder="Brief summary of the issue"
              maxLength={50}
              required
            />
            <div className="charCount">
              {formData.subject.length} / 50 characters
            </div>
          </div>
        </div>

        <div className="formGroup">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`formControl ${styles.formControl}`}
            placeholder="Detailed description of the issue..."
            maxLength={1000}
            required
          />
          <div className="charCount">
            {formData.description.length} / 1000 characters
          </div>
        </div>

        <div className="formRow">
          <div className="formGroup">
            <label htmlFor="urgencyLevel">Urgency Level</label>
            <select
              id="urgencyLevel"
              name="urgencyLevel"
              value={formData.urgencyLevel}
              onChange={handleChange}
              className="formControl"
              required
            >
              <option value="">Select Urgency</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="formGroup">
            <label htmlFor="impactLevel">Impact Level</label>
            <select
              id="impactLevel"
              name="impactLevel"
              value={formData.impactLevel}
              onChange={handleChange}
              className="formControl"
              required
            >
              <option value="">Select Impact</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* User tagging: search and select users to tag */}
        <div className="formGroup">
          <label htmlFor="userTags">Tag Users</label>
          <AsyncSelectComponent
            inputId="userTags"
            isMulti
            value={selectedUsers}
            onChange={handleUserChange}
            loadOptions={loadOptions}
            cacheOptions // Cache results by input to avoid redundant API calls
            defaultOptions={false} // Don't fetch on mount; wait for user input
            noOptionsMessage={() => 'No users found'}
            placeholder="Search users by name or email..."
            className={`formControl ${styles.reactSelect}`}
            formatOptionLabel={(option) => (
              <span>
                {option.label.split(' <')[0]}{' '}
                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                  &lt;{option.email}&gt;
                </span>
              </span>
            )}
          />
        </div>

        <div className="formActions">
          <button
            type="button"
            className={`mainBtn ${styles.btnSecondary}`}
            onClick={() => window.history.back()}
          >
            Cancel
          </button>
          <button type="submit" className="mainBtn" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Issue'}
          </button>
        </div>
      </form>
    </div>
  );
}
