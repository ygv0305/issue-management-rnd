// Node modules
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

// Services
import adminService from '../../services/adminService';

// Hooks
import { useProjects } from '../useProjectsAndTypes';

// MUI
import type { SelectChangeEvent } from '@mui/material/Select';

// Types
import type { SystemRoles, WhitelistUserData } from '../../types/authTypes';
import type { ProjectData } from '../../types/projectTypes';

const ROLES: SystemRoles[] = [
  'Student',
  'Supervisor',
  'Moderator',
  'PaperLeader',
  'Admin',
  'Client',
];

const INITIAL_FORM_DATA: WhitelistUserData = {
  email: '',
  role: 'Student' as SystemRoles,
  fullName: '',
  projectId: '',
};

interface StatusMessage {
  type: 'success' | 'error';
  text: string;
}

interface UseAccountManageReturn {
  formData: WhitelistUserData;
  submitting: boolean;
  statusMessage: StatusMessage | null;
  projects: ProjectData[];
  loading: boolean;
  roles: SystemRoles[];
  setFormData: (data: WhitelistUserData) => void;
  handleChange: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>,
  ) => void;
  handleSubmit: (e: React.SubmitEvent) => Promise<void>;
}

const isValidEmail = (email: string): boolean =>
  email.endsWith('@autuni.ac.nz');

export const useAccountManage = (): UseAccountManageReturn => {
  const [formData, setFormData] =
    useState<WhitelistUserData>(INITIAL_FORM_DATA);
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(
    null,
  );
  const { data: projects = [], isLoading: projectsLoading } = useProjects();

  const whitelistMutation = useMutation({
    mutationFn: async (data: WhitelistUserData) => {
      const dataToSubmit = { ...data };
      if (dataToSubmit.role !== 'Student') {
        delete dataToSubmit.projectId;
      }
      return await adminService.whitelistUser(dataToSubmit);
    },
    onSuccess: (res) => {
      if (res.success) {
        setStatusMessage({
          type: 'success',
          text: 'User successfully whitelisted!',
        });
        setFormData(INITIAL_FORM_DATA);
      } else {
        setStatusMessage({
          type: 'error',
          text: res.message || 'Failed to whitelist user.',
        });
      }
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      console.error('Error whitelisting user, ', error);
      const errorMsg =
        error.response?.data?.message ||
        'Failed to whitelist user. Please try again.';
      setStatusMessage({ type: 'error', text: errorMsg });
    },
  });

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!isValidEmail(formData.email)) {
      setStatusMessage({
        type: 'error',
        text: 'Email must be a valid @autuni.ac.nz address.',
      });
      return;
    }

    if (formData.role === 'Student' && !formData.projectId) {
      setStatusMessage({
        type: 'error',
        text: 'Student must work in a project. Please provide a Project ID.',
      });
      return;
    }

    whitelistMutation.mutate(formData);
  };

  return {
    formData,
    submitting: whitelistMutation.isPending,
    statusMessage,
    projects,
    loading: projectsLoading,
    roles: ROLES,
    setFormData,
    handleChange,
    handleSubmit,
  };
};
