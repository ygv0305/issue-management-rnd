// Node modules
import { useState, useEffect } from 'react';

// RBAC
import withPermission from '../../lib/rbac/withPermission';
import { PERMISSIONS } from '../../lib/rbac/allPermission';

// Services
import pLeaderService from '../../services/pLeaderService';

// Types
import type { IssueTypeData } from '../../types/issueTypes';
import type { ProjectData } from '../../types/projectTypes';

// Styles
import styles from './ProjectManage.module.css';

function ProjectManage() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [issueTypes, setIssueTypes] = useState<IssueTypeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const parsedProjects = JSON.parse(localStorage.getItem('projects')!);
      if (parsedProjects) {
        setProjects(parsedProjects);
      }

      const parsedIssueTypes = JSON.parse(localStorage.getItem('issueTypes')!);
      if (parsedIssueTypes) {
        setIssueTypes(parsedIssueTypes);
      }
    } catch (error) {
      console.error('Error reading projects or issue types, ', error);
      setProjects([]);
      setIssueTypes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleNewProject = async () => {
    const name = prompt('Enter new project name:');
    if (name) {
      try {
        const res = await pLeaderService.createProject(name);
        alert('Project created!');
        if (res.success && res.data) {
          const updatedProjects = [...projects, res.data];
          setProjects(updatedProjects);
          localStorage.setItem('projects', JSON.stringify(updatedProjects));
        }
      } catch (error) {
        alert('Failed to create project.');
      }
    }
  };

  const handleNewIssueType = async () => {
    const name = prompt('Enter new issue type name:');
    if (name) {
      try {
        const res = await pLeaderService.createIssueType(name);
        alert('Issue type created!');
        if (res.success && res.data) {
          const updatedIssueTypes = [...issueTypes, res.data];
          setIssueTypes(updatedIssueTypes);
          localStorage.setItem('issueTypes', JSON.stringify(updatedIssueTypes));
        }
      } catch (error) {
        alert('Failed to create issue type.');
      }
    }
  };

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
