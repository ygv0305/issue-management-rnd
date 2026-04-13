// MUI
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

// Types
import type { CommentData } from '../../../types/issueTypes';

// Components
import CommentItem from './CommentItem';

interface CommentListProps {
  comments: CommentData[];
  isLoading: boolean;
}

export default function CommentList({ comments, isLoading }: CommentListProps) {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (comments.length === 0) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ py: 3, textAlign: 'center' }}
      >
        No comments yet.
      </Typography>
    );
  }

  return (
    <Stack spacing={2} sx={{ mt: 1 }}>
      {comments.map((comment) => (
        <CommentItem key={comment._id} comment={comment} />
      ))}
    </Stack>
  );
}
