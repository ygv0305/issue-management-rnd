// MUI
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

// Types
import type { User } from '../../../types/authTypes';

interface TaggedUsersDialogProps {
  open: boolean;
  users: User[];
  onClose: () => void;
}

export default function TaggedUsersDialog({
  open,
  users,
  onClose,
}: TaggedUsersDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Tagged Users</DialogTitle>
      <DialogContent dividers>
        {users.length === 0 ? (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            No users tagged.
          </Typography>
        ) : (
          <List sx={{ p: 0 }}>
            {users.map((user) => (
              <ListItem key={user._id} sx={{ px: 0 }}>
                <ListItemText primary={user.fullName} secondary={user.email} />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
