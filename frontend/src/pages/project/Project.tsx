// Node modules
import { useEffect, useState } from 'react';

// RBAC
import withPermission from '../../lib/rbac/withPermission';
import { PERMISSIONS } from '../../lib/rbac/allPermission';

// Services
import pLeaderService from '../../services/pLeaderService';
import coreService from '../../services/coreService';

// Types
import type { ProjectData, IssueTypeData } from '../../types/issueTypes';

// Styles
import './project.css';

function Project() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [issueTypes, setIssueTypes] = useState<IssueTypeData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const typesRes = await coreService.getIssueTypes();
      if (typesRes.success) {
        setIssueTypes(typesRes.data);
      }

      const projectsRes = await pLeaderService.getProjects();
      if (projectsRes.success) {
        setProjects(projectsRes.projects);
      }
    } catch (error) {
      console.error('Failed to fetch project data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNewProject = async () => {
    const name = prompt('Enter new project name:');
    if (name) {
      try {
        await pLeaderService.createProject(name);
        alert('Project created!');
        fetchData();
      } catch (error) {
        alert('Failed to create project.');
      }
    }
  };

  const handleNewIssueType = async () => {
    const name = prompt('Enter new issue type name:');
    if (name) {
      try {
        await pLeaderService.createIssueType(name);
        alert('Issue type created!');
        fetchData();
      } catch (error) {
        alert('Failed to create issue type.');
      }
    }
  };

  if (loading)
    return <div className="project-page-container">Loading data...</div>;

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

export default withPermission(Project, PERMISSIONS.VIEW_PROJECT);
