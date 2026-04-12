// Hooks
import { useMyIssues } from '../../hooks/issue/useMyIssues';

// Components
import IssueModal from '../../components/issue-modal/IssueModal';
import IssueTable from '../../components/issue-table/IssueTable';

// Styles
import './IssueView.module.css';

export default function MyIssueView() {
  const {
    submittedIssues,
    assignedIssues,
    taggedIssues,
    loading,
    selectedIssue,
    canViewAssigned,
    setSelectedIssue,
  } = useMyIssues();

  if (loading) {
    return <div className="tableCont">Loading...</div>;
  }

  return (
    <div className="tableCont">
      <h1 className="viewTitle">My Issues Dashboard</h1>

      <IssueTable
        title="My Submitted Issues"
        issues={submittedIssues}
        onIssueSelect={setSelectedIssue}
      />

      {canViewAssigned && (
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
