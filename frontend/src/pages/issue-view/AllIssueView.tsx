// RBAC
import { PERMISSIONS } from '../../lib/rbac/allPermission';
import withPermission from '../../lib/rbac/withPermission';

// Hooks
import { useAllIssues } from '../../hooks/issue/useAllIssues';

// Components
import IssueModal from '../../components/issue-modal/IssueModal';
import IssueTable from '../../components/issue-table/IssueTable';

// Styles
import './IssueView.module.css';

function AllIssueView() {
  const {
    allIssues,
    loading,
    selectedIssue,
    setSelectedIssue,
    handleIssueUpdated,
  } = useAllIssues();

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
          onIssueUpdated={handleIssueUpdated}
        />
      )}
    </div>
  );
}

export default withPermission(AllIssueView, PERMISSIONS.VIEW_ALL_ISSUE);
