// MUI
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// Types
import type { CommentData } from '../../../types/issueTypes';

interface CommentItemProps {
  comment: CommentData;
}

export default function CommentItem({ comment }: CommentItemProps) {
  const userName = comment.userId?.fullName ?? 'Unknown';
  const email = comment.userId.email;
  const initial = userName[0].toUpperCase();

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Avatar
        sx={{
          width: 32,
          height: 32,
          bgcolor: 'primary.main',
          fontSize: 14,
        }}
      >
        {initial}
      </Avatar>
      <Box
        sx={{
          bgcolor: 'background.default',
          p: 1.5,
          borderRadius: 2,
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 0.5,
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {userName}
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', marginLeft: 0.5 }}
            >
              &lt;{email}&gt;
            </Typography>
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {new Date(comment.timestamp).toLocaleString()}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
          {comment.message}
        </Typography>
      </Box>
    </Box>
  );
}
