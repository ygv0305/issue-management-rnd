// MUI
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// Components
import Select from '../../atoms/CustomSelect';

// Types
import type { IssueStatus, IssuePriority } from '../../../types/issueTypes';

interface ActionsPanelProps {
  newStatus: IssueStatus | '';
  newPriority: IssuePriority | '';
  statusOptions: IssueStatus[];
  priorityOptions: IssuePriority[];
  isChanged: boolean | null;
  isUpdating: boolean;
  onStatusChange: (status: IssueStatus) => void;
  onPriorityChange: (priority: IssuePriority) => void;
  onConfirm: () => void;
}

export default function ActionsPanel({
  newStatus,
  newPriority,
  statusOptions,
  priorityOptions,
  isChanged,
  isUpdating,
  onStatusChange,
  onPriorityChange,
  onConfirm,
}: ActionsPanelProps) {
  return (
    <Stack spacing={3} sx={{ mx: 'auto', mt: 2, width: 400 }}>
      <Box>
        <Typography
          variant="caption"
          sx={{ mb: 1, display: 'block', color: 'text.secondary' }}
        >
          Change Status
        </Typography>
        <Select
          fullWidth
          value={newStatus}
          onChange={(e) => onStatusChange(e.target.value as IssueStatus)}
          size="small"
        >
          {statusOptions.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box>
        <Typography
          variant="caption"
          sx={{ mb: 1, display: 'block', color: 'text.secondary' }}
        >
          Change Priority
        </Typography>
        <Select
          fullWidth
          value={newPriority}
          onChange={(e) => onPriorityChange(e.target.value as IssuePriority)}
          size="small"
        >
          {priorityOptions.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Button
        variant="contained"
        color="primary"
        disabled={!isChanged || isUpdating}
        onClick={onConfirm}
        sx={{ alignSelf: 'flex-end' }}
      >
        {isUpdating ? 'Updating...' : 'Confirm Changes'}
      </Button>
    </Stack>
  );
}
