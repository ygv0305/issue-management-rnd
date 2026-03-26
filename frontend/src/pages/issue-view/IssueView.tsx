// Node modules
import { useEffect, useState } from 'react';

// Lib
import { useUser } from '../../lib/context/UserContext';
import { hasPermission } from '../../lib/rbac/hasPermission';
import { PERMISSIONS } from '../../lib/rbac/allPermission';

// Services
import coreService from '../../services/coreService';
import pLeaderService from '../../services/pLeaderService';

// Types
import type { IssueData } from '../../types/issueTypes';

// Styles
import './issueView.css';

export default function IssueView() {
  const { user } = useUser();
  const [myIssues, setMyIssues] = useState<IssueData[]>([]);
  const [allIssues, setAllIssues] = useState<IssueData[]>([]);
  const [loading, setLoading] = useState(true);

  const canViewAll = hasPermission(user, PERMISSIONS.VIEW_ALL_ISSUE);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const myIssuesRes = await coreService.getMyIssues();
        if (myIssuesRes.success) {
          setMyIssues(myIssuesRes.data);
        }

        if (canViewAll) {
          const allIssuesRes = await pLeaderService.getAllIssues();
          if (allIssuesRes.success) {
            setAllIssues(allIssuesRes.data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch issues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [canViewAll]);

  if (loading) {
    return <div className="issue-view-container">Loading issues...</div>;
  }

  return (
    <div className="issue-view-container">
      <h2>Issues</h2>

      <div className="issue-section">
        <h3>My Issues</h3>
        <table className="issue-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Subject</th>
              <th>Author</th>
              <th>Status</th>
              <th>Submitted Date</th>
            </tr>
          </thead>
          <tbody>
            {myIssues.map((issue) => (
              <tr key={issue._id}>
                <td>{issue._id.slice(-6).toUpperCase()}</td>
                <td>{issue.subject}</td>
                <td>{issue.author?.fullName || 'Unknown'}</td>
                <td>
                  <span
                    className={`status-badge status-${issue.status.toLowerCase().replace(' ', '-')}`}
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

      {canViewAll && (
        <div className="issue-section">
          <h3>All Submitted Issues</h3>
          <table className="issue-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Subject</th>
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
                  <td>{issue.author?.fullName || 'Unknown'}</td>
                  <td>
                    <span
                      className={`status-badge status-${issue.status.toLowerCase().replace(' ', '-')}`}
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
      )}
    </div>
  );
}
