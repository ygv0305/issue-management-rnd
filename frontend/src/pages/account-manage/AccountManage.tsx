// Hooks
import { useAccountManage } from '../../hooks/account-manage/useAccountManage';

// Lib
import withPermission from '../../lib/rbac/withPermission';
import { PERMISSIONS } from '../../lib/rbac/allPermission';

// MUI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';

// Components
import Select from '../../components/atoms/CustomSelect';
import PageLoader from '../../components/atoms/PageLoader';

function AccountManage() {
  const {
    formData,
    submitting,
    statusMessage,
    projects,
    loading,
    roles,
    handleChange,
    handleSubmit,
  } = useAccountManage();

  if (loading) {
    return <PageLoader message="Loading settings..." />;
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
        Whitelist New Account
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Pre-approve users to IMS.
      </Typography>

      {statusMessage && (
        <Alert severity={statusMessage.type} sx={{ mb: 4 }}>
          {statusMessage.text}
        </Alert>
      )}

      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Full Name"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                required
                slotProps={{
                  htmlInput: { maxLength: 50 },
                }}
                helperText={`${formData.fullName.length} / 50 characters`}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="user@autuni.ac.nz"
                required
                slotProps={{
                  htmlInput: { maxLength: 50 },
                }}
                helperText={`${formData.email.length} / 50 characters`}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required>
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  name="role"
                  value={formData.role}
                  label="Role"
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>Select Role</em>
                  </MenuItem>
                  {roles.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {formData.role === 'Student' && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth required={formData.role === 'Student'}>
                  <InputLabel id="projectId-label">Project</InputLabel>
                  <Select
                    labelId="projectId-label"
                    id="projectId"
                    name="projectId"
                    value={formData.projectId}
                    label="Project"
                    onChange={handleChange}
                  >
                    <MenuItem value="">
                      <em>Select a Project</em>
                    </MenuItem>
                    {projects.map((proj) => (
                      <MenuItem key={proj._id} value={proj._id}>
                        {proj.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    Student must work in a project.
                  </FormHelperText>
                </FormControl>
              </Grid>
            )}

            <Grid
              size={12}
              sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={submitting}
              >
                {submitting ? 'Creating...' : 'Create User'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}

export default withPermission(AccountManage, PERMISSIONS.WHITELIST_USER);
