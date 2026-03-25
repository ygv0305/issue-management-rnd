// Node modules

// RBAC
import withPermission from '../../lib/rbac/withPermission';
import { PERMISSIONS } from '../../lib/rbac/allPermission';

// Styles
import './project.css';

const MOCK_PROJECTS = [
  {
    id: 'PRJ-1',
    name: 'Frontend Refactor',
    description:
      'Refactoring React components to use modern hooks and context.',
  },
  {
    id: 'PRJ-2',
    name: 'Backend API V2',
    description:
      'Upgrading the legacy backend to a newer Express based structure.',
  },
];

const MOCK_ISSUE_TYPES = [
  { id: 'IT-1', name: 'Bug', description: 'A software bug or defect.' },
  { id: 'IT-2', name: 'Feature', description: 'A new feature request.' },
  {
    id: 'IT-3',
    name: 'Enhancement',
    description: 'An improvement to an existing feature.',
  },
];

function Project() {
  const handleNewProject = () => {
    alert('New Project modal would open here.');
  };

  const handleNewIssueType = () => {
    alert('New Issue Type modal would open here.');
  };

  return (
    <div className="project-page-container">
      <h2>Project Management</h2>

      <div className="project-section">
        <div className="section-header">
          <h3>Projects</h3>
          <button className="btn btn-primary" onClick={handleNewProject}>
            + New Project
          </button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_PROJECTS.map((project) => (
              <tr key={project.id}>
                <td>{project.id}</td>
                <td>{project.name}</td>
                <td>{project.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="project-section">
        <div className="section-header">
          <h3>Issue Types</h3>
          <button className="btn btn-primary" onClick={handleNewIssueType}>
            + New Issue Type
          </button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_ISSUE_TYPES.map((type) => (
              <tr key={type.id}>
                <td>{type.id}</td>
                <td>{type.name}</td>
                <td>{type.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Ensure only PaperLeader (or roles with VIEW_PROJECT permission) can access this page
export default withPermission(Project, PERMISSIONS.VIEW_PROJECT);
