// MUI
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

// Components
import CloseButton from '../../atoms/issue-modal/CloseButton';

// Lib
import { useUser } from '../../../lib/context/UserContext';
import { hasPermission } from '../../../lib/rbac/hasPermission';
import { PERMISSIONS } from '../../../lib/rbac/allPermission';

interface IssueModalHeaderProps {
  issueId: string;
  originAllIssue: boolean;
  isAssignedTo?: string;
  isAssignedToMe: boolean;
  isAssigning: boolean;
  onClose: () => void;
  onClick: () => void;
}

export default function IssueModalHeader({
  issueId,
  originAllIssue,
  isAssignedTo,
  isAssignedToMe,
  isAssigning,
  onClose,
  onClick,
}: IssueModalHeaderProps) {
  const { user } = useUser();

  return (
    <DialogTitle
      sx={{
        m: 0,
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <Typography sx={{ fontSize: '2rem', fontWeight: '500' }}>
          #{issueId.slice(-6).toUpperCase()}
        </Typography>
        {hasPermission(user, PERMISSIONS.ASSIGN_ISSUE) && originAllIssue && (
          <Button
            variant="contained"
            color="primary"
            onClick={onClick}
            disabled={isAssigning || (!isAssignedToMe && !!isAssignedTo)}
          >
            {isAssigning
              ? 'Loading...'
              : isAssignedToMe
                ? 'Unassign To Me'
                : isAssignedTo
                  ? `Assigned To ${isAssignedTo}`
                  : 'Assign To Me'}
          </Button>
        )}
      </Box>
      <CloseButton onClose={onClose} />
    </DialogTitle>
  );
}
