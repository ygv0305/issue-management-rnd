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

// Utils
import getPriorityColor from '../../utils/getPriorityColor';

function AllIssueView() {
  const [allIssues, setAllIssues] = useState<IssueData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await pLeaderService.getAllIssues();
        if (res.success) {
          setAllIssues(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch issues, ', error);
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
              <th className="priority-col"></th>
              <th className="id-col">ID</th>
              <th>Subject</th>
              <th className="normal-col">Type</th>
              <th className="normal-col">Author</th>
              <th className="id-col">Status</th>
            </tr>
          </thead>
          <tbody>
            {allIssues.map((issue) => (
              <tr key={issue._id}>
                <td className="priority-col">
                  <span
                    style={{
                      backgroundColor: getPriorityColor(issue.priority),
                    }}
                  ></span>
                </td>
                <td className="id-col">{issue._id.slice(-6).toUpperCase()}</td>
                <td>{issue.subject}</td>
                <td className="normal-col">{issue.type?.name || 'N/A'}</td>
                <td className="normal-col">
                  {issue.author?.fullName || 'Unknown'}
                </td>
                <td className="id-col">
                  <span
                    className={`status-badge status-${issue.status.toLowerCase()}`}
                  >
                    {issue.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default withPermission(AllIssueView, PERMISSIONS.VIEW_ALL_ISSUE);
