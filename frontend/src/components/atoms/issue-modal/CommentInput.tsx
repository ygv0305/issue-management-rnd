// MUI
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';

interface CommentInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.SubmitEvent) => void;
  isSubmitting: boolean;
}

export default function CommentInput({
  value,
  onChange,
  onSubmit,
  isSubmitting,
}: CommentInputProps) {
  return (
    <Box
      sx={{
        position: 'sticky',
        bottom: 0,
        bgcolor: 'background.paper',
        pt: 2,
        pb: 1,
      }}
    >
      <form onSubmit={onSubmit}>
        <TextField
          multiline
          rows={3}
          fullWidth
          placeholder="Post a message..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          variant="outlined"
          slotProps={{
            htmlInput: { maxLength: 1000 },
            input: {
              sx: {
                alignItems: 'flex-end',
                pb: 0.5,
                pr: 1,
              },
              endAdornment: (
                <IconButton
                  type="submit"
                  disabled={isSubmitting || !value.trim()}
                  color="primary"
                  sx={{ alignSelf: 'flex-end', mt: 'auto' }}
                >
                  <SendIcon />
                </IconButton>
              ),
            },
          }}
          helperText={`${value.length} / 1000`}
        />
      </form>
    </Box>
  );
}
