// Node modules
import { useState, useEffect } from 'react';

// Lib
import { PERMISSIONS } from '../../lib/rbac/allPermission';
import withPermission from '../../lib/rbac/withPermission';

// Hooks
import { useAllIssues } from '../../hooks/issue/useAllIssues';

// Components
import IssueModal from '../../components/organisms/IssueModal';
import IssueTable from '../../components/organisms/IssueTable';
import PageLoader from '../../components/atoms/PageLoader';

// MUI
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

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
    assignedIssues,
    loading,
    selectedIssue,
    setSelectedIssue,
    handleIssueUpdated,
    viewMode,
    handleViewChange,
  } = useAllIssues();

  if (loading || isMounting) {
    return <PageLoader message="Loading issues..." />;
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
          <ToggleButton value="all">All Issues</ToggleButton>
          <ToggleButton value="assigned">Assigned To Me</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {viewMode === 'all' ? (
        <IssueTable
          originAllIssue={true}
          issues={allIssues}
          onIssueSelect={setSelectedIssue}
        />
      ) : (
        <IssueTable
          originAllIssue={true}
          issues={assignedIssues}
          onIssueSelect={setSelectedIssue}
        />
      )}

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
