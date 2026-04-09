// Node modules
import { useEffect, useState } from 'react';

// Services
import coreService from '../../services/coreService';

// Lib
import { PERMISSIONS } from '../../lib/rbac/allPermission';
import { hasPermission } from '../../lib/rbac/hasPermission';
import { useUser } from '../../lib/context/UserContext';

// Types
import type { IssueData } from '../../types/issueTypes';

// Components
import IssueModal from '../../components/issue-modal/IssueModal';
import IssueTable from '../../components/issue-table/IssueTable';

// Styles
import './IssueView.module.css';

export default function MyIssueView() {
  const { user } = useUser();
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

  // Filter issues by submitted, assigned (PaperLeader only), tagged
  const currentUserId = user?._id;
  const submittedIssues = myIssues.filter(
    (issue) => issue.author._id === currentUserId,
  );
  const assignedIssues = myIssues.filter(
    (issue) => issue.assignedTo?._id === currentUserId,
  );
  const taggedIssues = myIssues.filter((issue) =>
    issue.userTags?.some((tag) => tag._id === currentUserId),
  );

  return (
    <div className="tableCont">
      <h1 className="viewTitle">My Issues Dashboard</h1>

      <IssueTable
        title="My Submitted Issues"
        issues={submittedIssues}
        onIssueSelect={setSelectedIssue}
      />

      {hasPermission(user, PERMISSIONS.VIEW_ALL_ISSUE) && (
        <IssueTable
          title="My Assigned Issues"
          issues={assignedIssues}
          onIssueSelect={setSelectedIssue}
        />
      )}

      <IssueTable
        title="Issues I'm Tagged In"
        issues={taggedIssues}
        onIssueSelect={setSelectedIssue}
      />

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
