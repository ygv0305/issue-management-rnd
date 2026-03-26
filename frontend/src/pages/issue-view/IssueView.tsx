// Lib
import { useUser } from '../../lib/context/UserContext';
import { hasPermission } from '../../lib/rbac/hasPermission';
import { PERMISSIONS } from '../../lib/rbac/allPermission';

// Styles
import './issueView.css';

// Mock Issues
const MOCK_MY_ISSUES = [
  { id: 'ISS-1238', subject: 'Add export functionality to reports', author: 'Sarah K.', status: 'Open', submittedDate: '13 Mar 2026' },
  { id: 'ISS-1235', subject: 'Security vulnerability in user authentication', author: 'Michael T.', status: 'Resolved', submittedDate: '11 Mar 2026' },
  { id: 'ISS-1232', subject: 'Improve search results relevance', author: 'John D.', status: 'In Progress', submittedDate: '10 Mar 2026' },
];

const MOCK_ALL_ISSUES = [
  { id: 'ISS-1247', subject: 'Login authentication failing for external users', author: 'Sarah K.', status: 'Open', submittedDate: '18 Mar 2026' },
  { id: 'ISS-1246', subject: 'Dashboard loading time exceeds 5 seconds', author: 'John D.', status: 'In Progress', submittedDate: '17 Mar 2026' },
  { id: 'ISS-1245', subject: 'Update footer copyright year to 2026', author: 'Emily R.', status: 'Resolved', submittedDate: '17 Mar 2026' },
  { id: 'ISS-1244', subject: 'Payment gateway returning 500 errors', author: 'Michael T.', status: 'In Progress', submittedDate: '16 Mar 2026' },
  { id: 'ISS-1243', subject: 'Add dark mode toggle to settings page', author: 'Sarah K.', status: 'Feedback', submittedDate: '16 Mar 2026' },
  { id: 'ISS-1242', subject: 'Typo in welcome email template', author: 'John D.', status: 'Closed', submittedDate: '15 Mar 2026' },
  { id: 'ISS-1241', subject: 'Mobile app crashes on iOS 17.4', author: 'Emily R.', status: 'Open', submittedDate: '15 Mar 2026' },
];

export default function IssueView() {
  const { user } = useUser();
  const canViewAll = hasPermission(user, PERMISSIONS.VIEW_ALL_ISSUE);

  const getStatusClass = (status: string) => status.toLowerCase().replace(/\s+/g, '-');
  const getDotColor = (status: string) => {
    if (status === 'Open') return 'blue';
    if (status === 'In Progress') return 'orange';
    if (status === 'Resolved') return 'green';
    if (status === 'Feedback') return 'purple';
    if (status === 'Closed') return 'grey';
    return 'grey';
  };

  return (
    <div className="issue-view-container">
      <h2>Issues</h2>

      {/* 🔶 Banner */}
      <div className="issue-banner">
        Viewing as Paper Leader — all users issues are visible
      </div>

      {/* 🎯 Filters */}
      <div className="issue-filters">
        <select><option>Status</option></select>
        <select><option>Projects</option></select>
        <select><option>Issue Type</option></select>
        <select><option>Users</option></select>
        <select><option>Sort By</option></select>
      </div>

      {/* 🔹 All Submitted Issues */}
      {canViewAll && (
        <div className="issue-section">
          <h3>All Submitted Issues</h3>
          <table className="issue-table">
            <thead>
              <tr>
                <th>ID No.</th>
                <th>Issue Description</th>
                <th>User/s</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_ALL_ISSUES.map((issue) => (
                <tr key={issue.id} className="issue-row">
                  <td className="issue-id">
                    <span className={`issue-dot ${getDotColor(issue.status)}`}></span>
                    {issue.id}
                  </td>
                  <td>{issue.subject}</td>
                  <td>{issue.author}</td>
                  <td>
                    <span className={`status-badge status-${getStatusClass(issue.status)}`}>
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

      {/* 🟣 My Raised Issues */}
      <div className="raised-section">
        <div className="raised-header">
          My raised issues
          <span className="count">{MOCK_MY_ISSUES.length}</span>
        </div>

        <table className="issue-table">
          <tbody>
            {MOCK_MY_ISSUES.map((issue) => (
              <tr key={issue.id} className="issue-row">
                <td className="issue-id">
                  <span className={`issue-dot ${getDotColor(issue.status)}`}></span>
                  {issue.id}
                </td>
                <td>{issue.subject}</td>
                <td>{issue.author}</td>
                <td>
                  <span className={`status-badge status-${getStatusClass(issue.status)}`}>
                    {issue.status}
                  </span>
                </td>
                <td>{issue.submittedDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}