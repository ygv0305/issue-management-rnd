import type { IssueData } from '../../types/issueTypes';
import styles from './IssueTable.module.css';

interface IssueTableProps {
  title?: string;
  issues: IssueData[];
  onIssueSelect: (issue: IssueData) => void;
}

export default function IssueTable({
  title,
  issues,
  onIssueSelect,
}: IssueTableProps) {
  return (
    <div className="tableCont">
      {title && <h2>{title}</h2>}

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
            {issues.length > 0 ? (
              issues.map((issue) => (
                <tr key={issue._id} onClick={() => onIssueSelect(issue)}>
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
              ))
            ) : (
              <tr>
                <td colSpan={6} className={styles.noFound}>
                  No issues found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
