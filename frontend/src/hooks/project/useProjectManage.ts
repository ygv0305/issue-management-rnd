// Node modules
import { useState } from 'react';

// Services
import pLeaderService from '../../services/pLeaderService';

// Types
import type { IssueTypeData } from '../../types/issueTypes';
import type { ProjectData } from '../../types/projectTypes';

interface UseProjectManageReturn {
  projects: ProjectData[];
  issueTypes: IssueTypeData[];
  loading: boolean;
  handleNewProject: () => Promise<void>;
  handleNewIssueType: () => Promise<void>;
}

const getDataFromStorage = <T>(key: string): T[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(key)!);
    return parsed || [];
  } catch (error) {
    console.error(`Error reading ${key}, `, error);
    return [];
  }
};

export const useProjectManage = (): UseProjectManageReturn => {
  // Initialize state directly from localStorage instead of using useEffect
  const [projects, setProjects] = useState<ProjectData[]>(() =>
    getDataFromStorage<ProjectData>('projects'),
  );
  const [issueTypes, setIssueTypes] = useState<IssueTypeData[]>(() =>
    getDataFromStorage<IssueTypeData>('issueTypes'),
  );
  const [loading] = useState(false);

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
      } catch {
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
      } catch {
        alert('Failed to create issue type.');
      }
    }
  };

  return {
    projects,
    issueTypes,
    loading,
    handleNewProject,
    handleNewIssueType,
  };
};
