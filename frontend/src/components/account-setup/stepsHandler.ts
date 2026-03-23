// Services
import SetupService from '../../services/setupService';

// Types
import type { User } from '../../types/authTypes';

export const handleNextStep1 = (
  fullName: string,
  setError: (err: string) => void,
  setStep: (step: number) => void,
) => {
  if (!fullName.trim()) {
    setError('Full name is required.');
    return;
  }
  setError('');
  setStep(2);
};

export const handlePreviousStep = (
  step: number,
  setStep: (step: number) => void,
  setError: (err: string) => void,
) => {
  setError('');
  if (step > 1) {
    setStep(step - 1);
  }
};

export const handleNextStep2 = (
  role: string,
  setStep: (step: number) => void,
  submitSetup: () => void,
) => {
  if (role !== 'Student') {
    submitSetup(); // Skip project selection
  } else {
    setStep(3);
  }
};

export const handleNextStep3 = (
  projectId: string,
  setError: (err: string) => void,
  submitSetup: () => void,
) => {
  if (!projectId) {
    setError('You must select a project.');
    return;
  }
  setError('');
  submitSetup();
};

export const submitSetup = async (
  fullName: string,
  role: string,
  projectId: string,
  setLoading: (loading: boolean) => void,
  setError: (err: string) => void,
  onComplete: (user: User) => void,
) => {
  setLoading(true);
  setError('');
  try {
    const response = await SetupService.setupProfile({
      fullName,
      role,
      ...(projectId.trim() && { projectId }),
    });

    if (response.success && response.user) {
      onComplete(response.user);
    } else {
      setError(response.message || 'Setup failed. Please try again.');
      setLoading(false);
    }
  } catch (error: any) {
    console.error(error);
    setError(error.response?.data?.message || 'Error completing setup.');
    setLoading(false);
  }
};
