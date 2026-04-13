// Node modules
import { useEffect, useState } from 'react';

// Services
import adminService from '../../services/adminService';

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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  handleSubmit: (e: React.SubmitEvent) => Promise<void>;
}

const getProjectsFromStorage = (): ProjectData[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem('projects')!);
    return parsed || [];
  } catch (error) {
    console.error('Error reading projects, ', error);
    return [];
  }
};

const isValidEmail = (email: string): boolean =>
  email.endsWith('@autuni.ac.nz');

export const useAccountManage = (): UseAccountManageReturn => {
  const [formData, setFormData] =
    useState<WhitelistUserData>(INITIAL_FORM_DATA);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(
    null,
  );
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setProjects(getProjectsFromStorage());
    setLoading(false);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    setSubmitting(true);
    try {
      const dataToSubmit = { ...formData };
      if (dataToSubmit.role !== 'Student') {
        delete dataToSubmit.projectId;
      }

      const res = await adminService.whitelistUser(dataToSubmit);
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
    } catch (error: unknown) {
      console.error('Error whitelisting user:', error);
      const err = error as { response?: { data?: { message?: string } } };
      const errorMsg =
        err.response?.data?.message ||
        'Failed to whitelist user. Please try again.';
      setStatusMessage({ type: 'error', text: errorMsg });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formData,
    submitting,
    statusMessage,
    projects,
    loading,
    roles: ROLES,
    setFormData,
    handleChange,
    handleSubmit,
  };
};
