// Node modules
import { useCallback, useState, useEffect } from 'react';

// Hooks
import { useMyIssues } from '../../hooks/issue/useMyIssues';

// Types
import type { IssueData } from '../../types/issueTypes';

// Components
import IssueModal from '../../components/organisms/IssueModal';
import IssueTable from '../../components/organisms/IssueTable';

// MUI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function MyIssueView() {
  const [isMounting, setIsMounting] = useState(true);

  useEffect(() => {
    // Defers rendering the heavy DataGrids to after the initial paint
    // Prevent the 'delayed' route switch behaviour
    const timer = setTimeout(() => setIsMounting(false), 20);
    return () => clearTimeout(timer);
  }, []);

  const {
    submittedIssues,
    assignedIssues,
    taggedIssues,
    loading,
    selectedIssue,
    canViewAssigned,
    setSelectedIssue,
    handleIssueUpdated,
  } = useMyIssues();

  // Ensures the onIssueSelect prop doesn’t create a new function on every render
  const handleIssueSelect = useCallback(
    (issue: IssueData) => setSelectedIssue(issue),
    [setSelectedIssue],
  );

  if (loading || isMounting) {
    return <Box sx={{ p: 3 }}>Loading...</Box>;
  }

  return (
    <Box sx={{ p: 0, width: '100%', maxWidth: '1200px', mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        My Issues Dashboard
      </Typography>

      <IssueTable
        title="My Submitted Issues"
        issues={submittedIssues}
        onIssueSelect={handleIssueSelect}
      />

      {canViewAssigned && (
        <IssueTable
          title="My Assigned Issues"
          issues={assignedIssues}
          onIssueSelect={handleIssueSelect}
        />
      )}

      <IssueTable
        title="Issues I'm Tagged In"
        issues={taggedIssues}
        onIssueSelect={handleIssueSelect}
      />

      <IssueModal
        issue={selectedIssue}
        originAllIssue={false}
        open={!!selectedIssue}
        onClose={() => setSelectedIssue(null)}
        onIssueUpdated={handleIssueUpdated}
      />
    </Box>
  );
}
