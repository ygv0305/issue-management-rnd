// MUI
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// Components
import Select from '../../atoms/CustomSelect';

// Types
import type {
  IssueStatus,
  IssueUrgencyAndImpact,
} from '../../../types/issueTypes';

interface ActionsPanelProps {
  newStatus: IssueStatus | '';
  newUrgency: IssueUrgencyAndImpact | '';
  newImpact: IssueUrgencyAndImpact | '';
  statusOptions: IssueStatus[];
  priorityOptions: IssueUrgencyAndImpact[];
  isChanged: boolean | null;
  isUpdating: boolean;
  onStatusChange: (status: IssueStatus) => void;
  onUrgencyChange: (priority: IssueUrgencyAndImpact) => void;
  onImpactChange: (priority: IssueUrgencyAndImpact) => void;
  onConfirm: () => void;
}

export default function ActionsPanel({
  newStatus,
  newUrgency,
  newImpact,
  statusOptions,
  priorityOptions,
  isChanged,
  isUpdating,
  onStatusChange,
  onUrgencyChange,
  onImpactChange,
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
          Change Urgency
        </Typography>
        <Select
          fullWidth
          value={newUrgency}
          onChange={(e) =>
            onUrgencyChange(e.target.value as IssueUrgencyAndImpact)
          }
          size="small"
        >
          {priorityOptions.map((opt) => (
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
          Change Impact
        </Typography>
        <Select
          fullWidth
          value={newImpact}
          onChange={(e) =>
            onImpactChange(e.target.value as IssueUrgencyAndImpact)
          }
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
