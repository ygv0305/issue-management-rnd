// Node modules
import { useEffect, useState } from 'react';

// Services
import coreService from '../../services/coreService';

// Types
import type { IssueData } from '../../types/issueTypes';

// Styles
import './issueView.css';

export default function MyIssueView() {
  const [myIssues, setMyIssues] = useState<IssueData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const myIssuesRes = await coreService.getMyIssues();
        if (myIssuesRes.success) {
          setMyIssues(myIssuesRes.data);
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
    return <div className="issue-view-container">Loading your issues...</div>;
  }

  return (
    <div className="issue-view-container">
      <h2>My Issues</h2>

      <div className="issue-section">
        <table className="issue-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Subject</th>
              <th>Type</th>
              <th>Status</th>
              <th>Submitted Date</th>
            </tr>
          </thead>
          <tbody>
            {myIssues.map((issue) => (
              <tr key={issue._id}>
                <td>{issue._id.slice(-6).toUpperCase()}</td>
                <td>{issue.subject}</td>
                <td>{issue.type?.name || 'N/A'}</td>
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
