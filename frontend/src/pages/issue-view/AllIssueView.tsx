// Node modules
import { useState, useEffect } from 'react';

// RBAC
import { PERMISSIONS } from '../../lib/rbac/allPermission';
import withPermission from '../../lib/rbac/withPermission';

// Hooks
import { useAllIssues } from '../../hooks/issue/useAllIssues';

// Components
import IssueModal from '../../components/organisms/IssueModal';
import IssueTable from '../../components/organisms/IssueTable';

// MUI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function AllIssueView() {
  const [isMounting, setIsMounting] = useState(true);

  useEffect(() => {
    // Defers rendering the heavy DataGrids to after the initial paint
    // Prevent the 'delayed' route switch behaviour
    const timer = setTimeout(() => setIsMounting(false), 20);
    return () => clearTimeout(timer);
  }, []);

  const {
    allIssues,
    loading,
    selectedIssue,
    setSelectedIssue,
    handleIssueUpdated,
  } = useAllIssues();

  if (loading || isMounting) {
    return <Box sx={{ p: 3 }}>Loading...</Box>;
  }

  return (
    <Box sx={{ p: 0, width: '100%', maxWidth: '1200px', mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        All Issues View
      </Typography>

      <IssueTable
        originAllIssue={true}
        issues={allIssues}
        onIssueSelect={setSelectedIssue}
      />

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
