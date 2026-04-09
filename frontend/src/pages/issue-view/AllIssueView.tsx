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
import IssueTable from '../../components/issue-table/IssueTable';

// Styles
import './IssueView.module.css';

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
      <h1 className="viewTitle">All Submitted Issues</h1>

      <IssueTable issues={allIssues} onIssueSelect={setSelectedIssue} />

      {selectedIssue && (
        <IssueModal
          issue={selectedIssue}
          originAllIssue={true}
          onClose={() => setSelectedIssue(null)}
          onIssueUpdated={(updatedIssue) => {
            setAllIssues((prev) =>
              prev.map((issue) =>
                issue._id === updatedIssue._id ? updatedIssue : issue,
              ),
            );
          }}
        />
      )}
    </div>
  );
}

export default withPermission(AllIssueView, PERMISSIONS.VIEW_ALL_ISSUE);
