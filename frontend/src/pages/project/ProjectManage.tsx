// RBAC
import withPermission from '../../lib/rbac/withPermission';
import { PERMISSIONS } from '../../lib/rbac/allPermission';

// Hooks
import { useProjectManage } from '../../hooks/project/useProjectManage';

// Styles
import styles from './ProjectManage.module.css';

function ProjectManage() {
  const {
    projects,
    issueTypes,
    loading,
    handleNewProject,
    handleNewIssueType,
  } = useProjectManage();

  if (loading) {
    return <div className={styles.projectManageCont}>Loading...</div>;
  }

  return (
    <div className={styles.projectManageCont}>
      <h1 className="viewTitle">Project Management</h1>

      <div className="tableSection">
        <div className={styles.sectionHeader}>
          <h3>Projects</h3>
          <button className="mainBtn" onClick={handleNewProject}>
            New Project
          </button>
        </div>
        <table className={`dataTable ${styles.dataTable}`}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project._id}>
                <td>{project._id.slice(-6).toUpperCase()}</td>
                <td>{project.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="tableSection">
        <div className={styles.sectionHeader}>
          <h3>Issue Types</h3>
          <button className="mainBtn" onClick={handleNewIssueType}>
            New Issue Type
          </button>
        </div>
        <table className={`dataTable ${styles.dataTable}`}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {issueTypes.map((type) => (
              <tr key={type._id}>
                <td>{type._id.slice(-6).toUpperCase()}</td>
                <td>{type.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default withPermission(ProjectManage, PERMISSIONS.CREATE_PROJECT);
