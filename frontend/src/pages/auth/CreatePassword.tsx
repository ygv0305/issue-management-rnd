// Hooks
import { useCreatePassword } from '../../hooks/auth/useCreatePassword';

// Components
import AuthTemplate from '../../components/templates/AuthTemplate';

// MUI
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

export default function CreatePassword() {
  const {
    email,
    token,
    password,
    confirmPassword,
    error,
    success,
    isLoading,
    isReset,
    setPassword,
    setConfirmPassword,
    handleSubmit,
  } = useCreatePassword();

  if (!token || !email) {
    return null;
  }

  return (
    <AuthTemplate>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 'bold', textAlign: 'center' }}
          gutterBottom
        >
          {isReset ? 'Reset Your Password' : 'Create Your Password'}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: 'center' }}
        >
          Please enter a strong password for <strong>{email}</strong>
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Password set successfully! Redirecting...
        </Alert>
      )}

      {!success && (
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your new password"
              fullWidth
              required
              variant="outlined"
            />

            <TextField
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              fullWidth
              required
              variant="outlined"
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={isLoading}
              sx={{ py: 1.5, fontWeight: 'bold' }}
            >
              {isLoading ? 'Saving...' : 'Save Password'}
            </Button>
          </Stack>
        </form>
      )}
    </AuthTemplate>
  );
}
