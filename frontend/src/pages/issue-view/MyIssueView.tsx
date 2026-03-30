// Node modules
import { useEffect, useState } from 'react';

// Services
import coreService from '../../services/coreService';

// Types
import type { IssueData } from '../../types/issueTypes';

// Styles
import './issueView.css';

const getPriorityColor = (priority?: string) => {
  switch (priority?.toLowerCase()) {
    case 'critical':
      return '#ff3707';
    case 'high':
      return '#ffa716';
    case 'medium':
      return '#4169e1';
    case 'low':
      return '#808080';
    default:
      return '#808080';
  }
};

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
              <th className="priority-col"></th>
              <th className="id-col">ID</th>
              <th>Subject</th>
              <th className="normal-col">Type</th>
              <th className="normal-col">Submitted Date</th>
              <th className="id-col">Status</th>
            </tr>
          </thead>
          <tbody>
            {myIssues.map((issue) => (
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
                  {new Date(issue.createdAt).toLocaleDateString()}
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
