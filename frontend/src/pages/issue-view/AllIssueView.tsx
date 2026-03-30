// Node modules
import { useEffect, useState } from 'react';

// RBAC
import { PERMISSIONS } from '../../lib/rbac/allPermission';
import withPermission from '../../lib/rbac/withPermission';

// Services
import pLeaderService from '../../services/pLeaderService';

// Types
import type { IssueData } from '../../types/issueTypes';

// Styles
import './issueView.css';

function AllIssueView() {
  const [allIssues, setAllIssues] = useState<IssueData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allIssuesRes = await pLeaderService.getAllIssues();
        if (allIssuesRes.success) {
          setAllIssues(allIssuesRes.data);
        }
      } catch (error) {
        console.error('Failed to fetch issues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="issue-view-container">Loading issues...</div>;
  }

  return (
    <div className="issue-view-container">
      <h2>All Submitted Issues</h2>

      <div className="issue-section">
        <table className="issue-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Subject</th>
              <th>Type</th>
              <th>Author</th>
              <th>Status</th>
              <th>Submitted Date</th>
            </tr>
          </thead>
          <tbody>
            {allIssues.map((issue) => (
              <tr key={issue._id}>
                <td>{issue._id.slice(-6).toUpperCase()}</td>
                <td>{issue.subject}</td>
                <td>{issue.type?.name || 'N/A'}</td>
                <td>{issue.author?.fullName || 'Unknown'}</td>
                <td>
                  <span
                    className={`status-badge status-${issue.status.toLowerCase()}`}
                  >
                    {issue.status}
                  </span>
                </td>
                <td>{new Date(issue.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default withPermission(AllIssueView, PERMISSIONS.VIEW_ALL_ISSUE);
