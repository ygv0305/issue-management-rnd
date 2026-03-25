// Lib
import { useUser } from '../../lib/context/UserContext';
import { hasPermission } from '../../lib/rbac/hasPermission';
import { PERMISSIONS } from '../../lib/rbac/allPermission';

// Styles
import './issueView.css';

const MOCK_MY_ISSUES = [
  {
    id: 'ISS-101',
    subject: 'Login bug',
    author: 'Me',
    status: 'Open',
    submittedDate: '2026-03-24',
  },
];

const MOCK_ALL_ISSUES = [
  ...MOCK_MY_ISSUES,
  {
    id: 'ISS-102',
    subject: 'UI Glitch',
    author: 'Alice Student',
    status: 'In Progress',
    submittedDate: '2026-03-23',
  },
  {
    id: 'ISS-103',
    subject: 'Server Crash',
    author: 'Bob Engineer',
    status: 'Resolved',
    submittedDate: '2026-03-22',
  },
];

export default function IssueView() {
  const { user } = useUser();

  const canViewAll = hasPermission(user, PERMISSIONS.VIEW_ALL_ISSUE);

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
            {MOCK_MY_ISSUES.map((issue) => (
              <tr key={issue.id}>
                <td>{issue.id}</td>
                <td>{issue.subject}</td>
                <td>{issue.author}</td>
                <td>
                  <span
                    className={`status-badge status-${issue.status.toLowerCase().replace(' ', '-')}`}
                  >
                    {issue.status}
                  </span>
                </td>
                <td>{issue.submittedDate}</td>
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
              {MOCK_ALL_ISSUES.map((issue) => (
                <tr key={issue.id}>
                  <td>{issue.id}</td>
                  <td>{issue.subject}</td>
                  <td>{issue.author}</td>
                  <td>
                    <span
                      className={`status-badge status-${issue.status.toLowerCase().replace(' ', '-')}`}
                    >
                      {issue.status}
                    </span>
                  </td>
                  <td>{issue.submittedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
