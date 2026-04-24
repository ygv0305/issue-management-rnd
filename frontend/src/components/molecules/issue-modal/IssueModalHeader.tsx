// MUI
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

// Components
import CloseButton from '../../atoms/issue-modal/CloseButton';

interface IssueModalHeaderProps {
  issueId: string;
  onClose: () => void;
}

export default function IssueModalHeader({
  issueId,
  onClose,
}: IssueModalHeaderProps) {
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
      <Typography sx={{ fontSize: '2rem', fontWeight: '500' }}>
        #{issueId.slice(-6).toUpperCase()}
      </Typography>
      <CloseButton onClose={onClose} />
    </DialogTitle>
  );
}
