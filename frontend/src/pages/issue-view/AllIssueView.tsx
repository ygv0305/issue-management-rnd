// Node modules
import { useCallback } from 'react';

// RBAC
import { PERMISSIONS } from '../../lib/rbac/allPermission';
import withPermission from '../../lib/rbac/withPermission';

// Hooks
import { useAllIssues } from '../../hooks/issue/useAllIssues';

// Types
import type { IssueData } from '../../types/issueTypes';

// Components
import IssueModal from '../../components/organisms/IssueModal';
import IssueTable from '../../components/organisms/IssueTable';

// MUI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function AllIssueView() {
  const {
    allIssues,
    loading,
    selectedIssue,
    setSelectedIssue,
    handleIssueUpdated,
  } = useAllIssues();

  const handleIssueSelect = useCallback(
    (issue: IssueData) => setSelectedIssue(issue),
    [setSelectedIssue],
  );

  if (loading) {
    return <Box sx={{ p: 3 }}>Loading...</Box>;
  }

  return (
    <Box sx={{ p: 0, width: '100%' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        All Submitted Issues
      </Typography>

      <IssueTable issues={allIssues} onIssueSelect={handleIssueSelect} />

      <IssueModal
        issue={selectedIssue}
        originAllIssue={true}
        open={!!selectedIssue}
        onClose={() => setSelectedIssue(null)}
        onIssueUpdated={handleIssueUpdated}
      />
    </Box>
  );
}

export default withPermission(AllIssueView, PERMISSIONS.VIEW_ALL_ISSUE);
