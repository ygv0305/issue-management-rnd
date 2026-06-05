// MUI
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

// Types
import type { IssueData } from '../../../types/issueTypes';

// Components
import StatusBadge from '../../atoms/StatusBadge';
import TaggedUsersDialog from '../../atoms/issue-modal/TaggedUsersDialog';

// Hooks
import { useState } from 'react';

interface OverviewTabProps {
  issue: IssueData;
}

export default function OverviewTab({ issue }: OverviewTabProps) {
  const [usersDialogOpen, setUsersDialogOpen] = useState(false);

  return (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      <Grid size={12}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Subject
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {issue.subject}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Created By
        </Typography>
        <Typography variant="body2">
          {issue.author?.fullName || 'Unknown'}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {issue.author.email}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Created On
        </Typography>
        <Typography variant="body2">
          {new Date(issue.createdAt).toLocaleString()}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Type
        </Typography>
        <Typography variant="body2">{issue.type.name}</Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Tagged Users
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2">
            {issue.userTags.length > 0
              ? `${issue.userTags.length} users`
              : 'None'}
          </Typography>
          {issue.userTags.length > 0 && (
            <Button variant="text" onClick={() => setUsersDialogOpen(true)}>
              See details
            </Button>
          )}
        </Box>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography
          variant="caption"
          sx={{ display: 'block', mb: 0.5, color: 'text.secondary' }}
        >
          Status
        </Typography>
        <StatusBadge status={issue.status} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography
          variant="caption"
          sx={{ display: 'block', mb: 0.5, color: 'text.secondary' }}
        >
          Urgency & Impact
        </Typography>
        <StatusBadge priority={issue.urgency} />
        <StatusBadge priority={issue.impact} />
      </Grid>
      <Grid size={12}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Description
        </Typography>
        <Box
          sx={{
            mt: 1,
            p: 2,
            bgcolor: 'background.default',
            borderRadius: 1,
          }}
        >
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
            {issue.description}
          </Typography>
        </Box>
      </Grid>

      <TaggedUsersDialog
        open={usersDialogOpen}
        users={issue.userTags}
        onClose={() => setUsersDialogOpen(false)}
      />
    </Grid>
  );
}
