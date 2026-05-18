// MUI
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Fab from '@mui/material/Fab';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// Types
import type { CommentData } from '../../../types/issueTypes';

// Hooks
import { useCommentList } from '../../../hooks/issue/useCommentList';

// Components
import CommentItem from './CommentItem';

interface CommentListProps {
  comments: CommentData[];
  isLoading: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

export default function CommentList({
  comments,
  isLoading,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: CommentListProps) {
  const {
    scrollContainerRef,
    showScrollButton,
    handleScroll,
    handleScrollToBottom,
  } = useCommentList({
    comments,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  if (isLoading && !isFetchingNextPage) {
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
    <Box sx={{ position: 'relative', height: '100%' }}>
      <Stack
        spacing={2}
        ref={scrollContainerRef}
        onScroll={handleScroll}
        sx={{
          height: '100%',
          py: 2,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          '&::-webkit-scrollbar': { width: '8px' },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'grey.300',
            borderRadius: '4px',
          },
        }}
      >
        {isFetchingNextPage && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
            <CircularProgress size={16} />
          </Box>
        )}

        {comments.map((comment) => (
          <CommentItem key={comment._id} comment={comment} />
        ))}
      </Stack>

      {showScrollButton && (
        <Fab
          size="small"
          color="primary"
          onClick={handleScrollToBottom}
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            zIndex: 1,
          }}
        >
          <KeyboardArrowDownIcon />
        </Fab>
      )}
    </Box>
  );
}
