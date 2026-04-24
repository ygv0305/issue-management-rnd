// Hooks
import { useAuth } from '../../hooks/auth/useAuth';

// Components
import AuthTemplate from '../../components/templates/AuthTemplate';

// MUI
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import { styled } from '@mui/material/styles';

const NoAsteriskTextField = styled(TextField)({
  '& .MuiFormLabel-asterisk': {
    display: 'none',
  },
});

export default function Auth() {
  const {
    authMode,
    email,
    password,
    error,
    isLoading,
    setEmail,
    setPassword,
    authModeChange,
    handleSubmit,
  } = useAuth();

  const getTitle = () => {
    switch (authMode) {
      case 'login':
        return 'Welcome Back';
      case 'signup':
        return 'Create Account';
      case 'reset':
        return 'Forgot Password';
    }
  };

  const getSubtitle = () => {
    if (authMode === 'login') return null;
    return `Enter your email to request a link to
      ${authMode === 'signup' ? 'create an account' : 'reset your password'}.`;
  };

  return (
    <AuthTemplate>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 'bold', textAlign: 'center' }}
          gutterBottom
        >
          {getTitle()}
        </Typography>
        {getSubtitle() && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: 'center' }}
          >
            {getSubtitle()}
          </Typography>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <SvgIcon sx={{ mr: 1.5, my: 0.5 }}>
              <svg
                width="800px"
                height="800px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </SvgIcon>
            <NoAsteriskTextField
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="abc1234@autuni.ac.nz"
              fullWidth
              required
              variant="standard"
            />
          </Box>

          {authMode === 'login' && (
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <SvgIcon sx={{ mr: 1.5, my: 0.5 }}>
                <svg
                  width="800px"
                  height="800px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 10.0288C7.47142 10 8.05259 10 8.8 10H15.2C15.9474 10 16.5286 10 17 10.0288M7 10.0288C6.41168 10.0647 5.99429 10.1455 5.63803 10.327C5.07354 10.6146 4.6146 11.0735 4.32698 11.638C4 12.2798 4 13.1198 4 14.8V16.2C4 17.8802 4 18.7202 4.32698 19.362C4.6146 19.9265 5.07354 20.3854 5.63803 20.673C6.27976 21 7.11984 21 8.8 21H15.2C16.8802 21 17.7202 21 18.362 20.673C18.9265 20.3854 19.3854 19.9265 19.673 19.362C20 18.7202 20 17.8802 20 16.2V14.8C20 13.1198 20 12.2798 19.673 11.638C19.3854 11.0735 18.9265 10.6146 18.362 10.327C18.0057 10.1455 17.5883 10.0647 17 10.0288M7 10.0288V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V10.0288"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </SvgIcon>
              <NoAsteriskTextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                fullWidth
                required
                variant="standard"
              />
            </Box>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={isLoading}
            sx={{ py: 1.5, fontWeight: 'bold' }}
          >
            {isLoading
              ? 'Processing...'
              : authMode === 'login'
                ? 'Log In'
                : authMode === 'signup'
                  ? 'Sign Up'
                  : 'Send Link'}
          </Button>
        </Stack>
      </form>

      <Box
        sx={{
          mt: 3,
          pt: 2,
          borderTop: 1,
          borderColor: 'divider',
          textAlign: 'center',
        }}
      >
        {authMode === 'login' ? (
          <Stack direction="row" spacing={2} sx={{ justifyContent: 'center' }}>
            <Button
              variant="text"
              size="medium"
              onClick={() => authModeChange('signup')}
            >
              Create Account
            </Button>
            <Button
              variant="text"
              size="medium"
              onClick={() => authModeChange('reset')}
            >
              Forgot Password?
            </Button>
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {authMode === 'signup' ? 'Already have an account? ' : 'Back to '}
            <Button
              variant="text"
              sx={{ p: 0, minWidth: 'auto', textTransform: 'none' }}
              onClick={() => authModeChange('login')}
            >
              Log in
            </Button>
          </Typography>
        )}
      </Box>
    </AuthTemplate>
  );
}
