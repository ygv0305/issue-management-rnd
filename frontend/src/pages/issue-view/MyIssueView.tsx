// Node modules
import { useEffect, useState } from 'react';

// Services
import coreService from '../../services/coreService';

// Types
import type { IssueData } from '../../types/issueTypes';

// Components
import IssueModal from '../../components/issue-modal/IssueModal';

// Styles
import styles from './IssueView.module.css';

export default function MyIssueView() {
  const [myIssues, setMyIssues] = useState<IssueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState<IssueData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await coreService.getMyIssues();
        if (res.success) {
          setMyIssues(res.data);
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
      <h2>My Issues</h2>

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
            {myIssues.map((issue) => (
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
          originAllIssue={false}
          onClose={() => setSelectedIssue(null)}
        />
      )}
    </div>
  );
}
