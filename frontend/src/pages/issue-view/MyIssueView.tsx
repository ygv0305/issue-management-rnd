// Node modules
import { useState, useEffect } from 'react';

// Hooks
import { useMyIssues } from '../../hooks/issue/useMyIssues';

// Components
import IssueModal from '../../components/organisms/IssueModal';
import IssueTable from '../../components/organisms/IssueTable';

// MUI
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

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
    viewMode,
    handleViewChange,
  } = useMyIssues();

  if (submittedLoading || taggedLoading || isMounting) {
    return <Box sx={{ p: 3 }}>Loading...</Box>;
  }

  return (
    <Box sx={{ p: 0, width: '100%', maxWidth: '1200px', mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewChange}
          aria-label="issue view mode"
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            p: 0.5,
            borderRadius: '12px',
            '& .MuiToggleButton-root': {
              px: 3,
              py: 1,
              borderRadius: '8px',
              border: 'none',
              textTransform: 'none',
              fontWeight: 500,
              gap: 1,
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              },
            },
          }}
        >
          <ToggleButton value="submitted">My Submitted Issues</ToggleButton>
          <ToggleButton value="tagged">My Tagged Issues</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {viewMode === 'submitted' ? (
        <IssueTable
          originAllIssue={false}
          issues={submittedIssues}
          onIssueSelect={setSelectedIssue}
        />
      ) : (
        <IssueTable
          originAllIssue={false}
          issues={taggedIssues}
          onIssueSelect={setSelectedIssue}
        />
      )}

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
