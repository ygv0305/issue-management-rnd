// Hooks
import { useCreateIssue } from '../../hooks/issue/useCreateIssue';

// MUI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

// Components
import Select from '../../components/atoms/CustomSelect';
import PriorityTooltip from '../../components/atoms/PriorityTooltip';

// Utils
import { urgencyData, impactData } from '../../utils/priorityJustifyData';

export default function CreateIssue() {
  const {
    issueTypes,
    formData,
    submitting,
    loading,
    selectedUsers,
    loadOptions,
    AsyncSelectComponent,
    handleUserChange,
    handleChange,
    handleSubmit,
  } = useCreateIssue();

  if (loading) {
    return <Box sx={{ p: 3 }}>Loading...</Box>;
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Create New Issue
      </Typography>

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
              <FormControl fullWidth required>
                <InputLabel id="issueType-label">Issue Type</InputLabel>
                <Select
                  labelId="issueType-label"
                  id="issueType"
                  name="issueType"
                  value={formData.issueType}
                  onChange={handleChange}
                  label="Issue Type"
                >
                  <MenuItem value="">
                    <em>Select Type</em>
                  </MenuItem>
                  {issueTypes.map((type) => (
                    <MenuItem key={type._id} value={type._id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Subject"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Brief summary of the issue"
                required
                slotProps={{
                  htmlInput: { maxLength: 50 },
                }}
                helperText={`${formData.subject.length} / 50 characters`}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Description"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Detailed description of the issue..."
                multiline
                rows={6}
                required
                slotProps={{
                  htmlInput: { maxLength: 1000 },
                }}
                helperText={`${formData.description.length} / 1000 characters`}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
              <FormControl fullWidth required>
                <InputLabel id="urgencyLevel-label">Urgency Level</InputLabel>
                <Select
                  labelId="urgencyLevel-label"
                  id="urgencyLevel"
                  name="urgencyLevel"
                  value={formData.urgencyLevel}
                  onChange={handleChange}
                  label="Urgency Level"
                >
                  <MenuItem value="">
                    <em>Select Urgency</em>
                  </MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
              </FormControl>
              <PriorityTooltip data={urgencyData} />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
              <FormControl fullWidth required>
                <InputLabel id="impactLevel-label">Impact Level</InputLabel>
                <Select
                  labelId="impactLevel-label"
                  id="impactLevel"
                  name="impactLevel"
                  value={formData.impactLevel}
                  onChange={handleChange}
                  label="Impact Level"
                >
                  <MenuItem value="">
                    <em>Select Impact</em>
                  </MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
              </FormControl>
              <PriorityTooltip data={impactData} />
            </Grid>

            <Grid size={12}>
              <Box sx={{ mb: 1 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontWeight: 500 }}
                >
                  Tag Users
                </Typography>
              </Box>
              <Box
                sx={{
                  '& .select__control': {
                    minHeight: '56px',
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                    borderRadius: '4px',
                    '&:hover': {
                      borderColor: 'rgba(0, 0, 0, 0.87)',
                    },
                  },
                }}
              >
                <AsyncSelectComponent
                  inputId="userTags"
                  isMulti
                  value={selectedUsers}
                  onChange={handleUserChange}
                  loadOptions={loadOptions}
                  cacheOptions
                  defaultOptions={false}
                  noOptionsMessage={() => 'No users found'}
                  placeholder="Search users by name or email..."
                  classNamePrefix="select"
                  formatOptionLabel={(option) => (
                    <span>
                      {option.label.split(' <')[0]}{' '}
                      <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                        &lt;{option.email}&gt;
                      </span>
                    </span>
                  )}
                />
              </Box>
            </Grid>

            <Grid
              size={12}
              sx={{
                mt: 2,
                display: 'flex',
                gap: 2,
                justifyContent: 'flex-end',
              }}
            >
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                onClick={() => window.history.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Issue'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}
