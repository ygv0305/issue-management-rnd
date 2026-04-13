import Chip from '@mui/material/Chip';
import type { IssueStatus, IssuePriority } from '../../types/issueTypes';

interface StatusBadgeProps {
  status?: IssueStatus;
  priority?: IssuePriority;
  size?: 'small' | 'medium';
}

export default function StatusBadge({
  status,
  priority,
  size = 'small',
}: StatusBadgeProps) {
  let label = '';
  let backgroundColor = '';
  let textColor = '';

  if (status) {
    label = status;
    switch (status) {
      case 'New':
      case 'ReOpen':
        backgroundColor = '#e6f0fa';
        textColor = '#2c5f8a';
        break;
      case 'InProgress':
        backgroundColor = '#fff2e0';
        textColor = '#b45f06';
        break;
      case 'Resolved':
        backgroundColor = '#e8f5e9';
        textColor = '#2e7d32';
        break;
      case 'Closed':
        backgroundColor = '#efebe9';
        textColor = '#5d4037';
        break;
    }
  } else if (priority) {
    label = priority;
    switch (priority) {
      case 'Low':
        backgroundColor = '#f0f4ec';
        textColor = '#4e6a3b';
        break;
      case 'Medium':
        backgroundColor = '#fff2e0';
        textColor = '#b45f06';
        break;
      case 'High':
        backgroundColor = '#f3e5f5';
        textColor = '#7b1fa2';
        break;
      case 'Critical':
        backgroundColor = '#ffebee';
        textColor = '#c62828';
        break;
    }
  }

  if (!label) return null;

  return (
    <Chip
      label={label}
      size={size}
      variant="filled"
      sx={{
        fontWeight: '500',
        backgroundColor,
        color: textColor,
        '& .MuiChip-label': {
          color: textColor,
        },
      }}
    />
  );
}
