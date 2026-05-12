// Node modules
import { useState, useEffect } from 'react';

// Hooks
import { useMyIssues } from '../../hooks/issue/useMyIssues';

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
    taggedIssues,
    submittedLoading,
    taggedLoading,
    selectedIssue,
    setSelectedIssue,
    handleIssueUpdated,
    submittedPagination,
    setSubmittedPagination,
    submittedTotal,
    taggedPagination,
    setTaggedPagination,
    taggedTotal,
  } = useMyIssues();

  if (isMounting) {
    return <Box sx={{ p: 3 }}>Loading...</Box>;
  }

  return (
    <Box sx={{ p: 0, width: '100%', maxWidth: '1200px', mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        My Issues View
      </Typography>

      <IssueTable
        title="My Submitted Issues"
        originAllIssue={false}
        issues={submittedIssues}
        onIssueSelect={setSelectedIssue}
        // Pagination props for Submitted issues
        totalCount={submittedTotal}
        paginationModel={submittedPagination}
        onPaginationModelChange={setSubmittedPagination}
        isLoading={submittedLoading}
      />

      <IssueTable
        title="Issues I'm Tagged In"
        originAllIssue={false}
        issues={taggedIssues}
        onIssueSelect={setSelectedIssue}
        // Pagination props for Tagged issues
        totalCount={taggedTotal}
        paginationModel={taggedPagination}
        onPaginationModelChange={setTaggedPagination}
        isLoading={taggedLoading}
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
