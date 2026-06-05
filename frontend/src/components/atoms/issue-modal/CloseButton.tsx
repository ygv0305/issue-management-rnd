// MUI
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface CloseButtonProps {
  onClose: () => void;
}

export default function CloseButton({ onClose }: CloseButtonProps) {
  return (
    <IconButton
      aria-label="close"
      onClick={onClose}
      sx={{ color: (theme) => theme.palette.grey[500] }}
    >
      <CloseIcon />
    </IconButton>
  );
}
