// RBAC
import withPermission from '../../lib/rbac/withPermission';
import { PERMISSIONS } from '../../lib/rbac/allPermission';

// Hooks
import { useProjectManage } from '../../hooks/project/useProjectManage';

// MUI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

function ProjectManage() {
  const {
    projects,
    issueTypes,
    loading,
    handleNewProject,
    handleNewIssueType,
  } = useProjectManage();

  if (loading) {
    return <Box sx={{ p: 3 }}>Loading...</Box>;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Project Management
      </Typography>

      <Box sx={{ mb: 6 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 500 }}>
            Projects
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNewProject}
          >
            New Project
          </Button>
        </Box>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ border: '1px solid', borderColor: 'divider' }}
        >
          <Table>
            <TableHead sx={{ bgcolor: 'background.default' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project._id} hover>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      #{project._id.slice(-6).toUpperCase()}
                    </Typography>
                  </TableCell>
                  <TableCell>{project.name}</TableCell>
                </TableRow>
              ))}
              {projects.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    align="center"
                    sx={{ py: 3, color: 'text.secondary' }}
                  >
                    No projects found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box sx={{ mb: 6 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 500 }}>
            Issue Types
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNewIssueType}
          >
            New Issue Type
          </Button>
        </Box>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ border: '1px solid', borderColor: 'divider' }}
        >
          <Table>
            <TableHead sx={{ bgcolor: 'background.default' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {issueTypes.map((type) => (
                <TableRow key={type._id} hover>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      #{type._id.slice(-6).toUpperCase()}
                    </Typography>
                  </TableCell>
                  <TableCell>{type.name}</TableCell>
                </TableRow>
              ))}
              {issueTypes.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    align="center"
                    sx={{ py: 3, color: 'text.secondary' }}
                  >
                    No issue types found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default withPermission(ProjectManage, PERMISSIONS.CREATE_PROJECT);
