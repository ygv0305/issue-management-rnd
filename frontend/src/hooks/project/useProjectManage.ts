// Node modules
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Services
import pLeaderService from '../../services/pLeaderService';

// Hooks
import { useProjects, useIssueTypes } from '../useSyncGlobalData';

// Types
import type { IssueTypeData } from '../../types/issueTypes';
import type { ProjectData } from '../../types/projectTypes';

// Lib
import { QUERY_KEYS } from '../../lib/react-query/queryKeys';

interface UseProjectManageReturn {
  projects: ProjectData[];
  issueTypes: IssueTypeData[];
  loading: boolean;
  handleNewProject: () => Promise<void>;
  handleNewIssueType: () => Promise<void>;
}

export const useProjectManage = (): UseProjectManageReturn => {
  const queryClient = useQueryClient();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: issueTypes = [], isLoading: typesLoading } = useIssueTypes();

  const createProjectMutation = useMutation({
    mutationFn: (name: string) => pLeaderService.createProject(name),
    onSuccess: (res) => {
      if (res.success && res.data) {
        alert('Project created!');
        queryClient.setQueryData(
          QUERY_KEYS.projects,
          (old: ProjectData[] = []) => [...old, res.data!],
        );
        // Sync to localStorage
        const updated = [...projects, res.data];
        localStorage.setItem('projects', JSON.stringify(updated));
      }
    },
    onError: () => alert('Failed to create project.'),
  });

  const createIssueTypeMutation = useMutation({
    mutationFn: (name: string) => pLeaderService.createIssueType(name),
    onSuccess: (res) => {
      if (res.success && res.data) {
        alert('Issue type created!');
        queryClient.setQueryData(
          QUERY_KEYS.issueTypes,
          (old: IssueTypeData[] = []) => [...old, res.data!],
        );
        // Sync to localStorage
        const updated = [...issueTypes, res.data];
        localStorage.setItem('issueTypes', JSON.stringify(updated));
      }
    },
    onError: () => alert('Failed to create issue type.'),
  });

  const handleNewProject = async () => {
    const name = prompt('Enter new project name:');
    if (name) {
      createProjectMutation.mutate(name);
    }
  };

  const handleNewIssueType = async () => {
    const name = prompt('Enter new issue type name:');
    if (name) {
      createIssueTypeMutation.mutate(name);
    }
  };

  return {
    projects,
    issueTypes,
    loading: projectsLoading || typesLoading,
    handleNewProject,
    handleNewIssueType,
  };
};
