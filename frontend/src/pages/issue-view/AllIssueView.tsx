// Node modules
import { useEffect, useState } from 'react';

// RBAC
import { PERMISSIONS } from '../../lib/rbac/allPermission';
import withPermission from '../../lib/rbac/withPermission';

// Services
import pLeaderService from '../../services/pLeaderService';

// Types
import type { IssueData } from '../../types/issueTypes';

// Components
import IssueModal from '../../components/issue-modal/IssueModal';

// Styles
import styles from './IssueView.module.css';

function AllIssueView() {
  const [allIssues, setAllIssues] = useState<IssueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState<IssueData | null>(null);

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
    return <div className="tableCont">Loading...</div>;
  }

  return (
    <div className="tableCont">
      <h2>All Submitted Issues</h2>

      <div className="tableSection">
        <table className="dataTable">
          <thead>
            <tr>
              <th className={styles.smallCol}>ID</th>
              <th style={{ textAlign: 'left', padding: '1rem 1.5rem' }}>
                Subject
              </th>
              <th className={styles.normalCol}>Type</th>
              <th className={styles.smallCol}>Date</th>
              <th className={styles.smallCol}>Status</th>
              <th className={styles.smallCol}>Priority</th>
            </tr>
          </thead>
          <tbody>
            {allIssues.map((issue) => (
              <tr key={issue._id} onClick={() => setSelectedIssue(issue)}>
                <td className={styles.smallCol}>
                  {issue._id.slice(-6).toUpperCase()}
                </td>
                <td style={{ textAlign: 'left', padding: '1rem 1.5rem' }}>
                  {issue.subject}
                </td>
                <td className={styles.normalCol}>{issue.type.name}</td>
                <td className={styles.smallCol}>
                  {new Date(issue.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                  })}
                </td>
                <td className={styles.smallCol}>
                  <span className={`statusBadge status${issue.status}`}>
                    {issue.status}
                  </span>
                </td>
                <td className={styles.smallCol}>
                  <span className={`statusBadge priority${issue.priority}`}>
                    {issue.priority}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedIssue && (
        <IssueModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
          // Update new comments optimistically
          onCommentAdded={(newComment) => {
            setAllIssues((prev) =>
              prev.map((issue) =>
                issue._id === selectedIssue._id
                  ? { ...issue, thread: [...(issue.thread || []), newComment] }
                  : issue,
              ),
            );
          }}
        />
      )}
    </div>
  );
}

export default withPermission(AllIssueView, PERMISSIONS.VIEW_ALL_ISSUE);
