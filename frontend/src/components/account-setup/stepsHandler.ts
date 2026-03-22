import type { Dispatch, SetStateAction } from 'react';
import SetupService from '../../services/setupService';
import type { User } from '../../types/authTypes';

export const handleNextStep1 = (
  fullName: string,
  setError: (err: string) => void,
  setStep: (step: number) => void
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
  setError: (err: string) => void
) => {
  setError('');
  if (step > 1) {
    setStep(step - 1);
  }
};

export const handleNextStep2 = (
  role: string,
  setStep: (step: number) => void,
  submitSetup: () => void
) => {
  if (['PaperLeader', 'Admin'].includes(role)) {
    submitSetup(); // Skip project selection
  } else {
    setStep(3);
  }
};

export const handleProjectToggle = (
  id: string,
  role: string,
  setProjectIds: Dispatch<SetStateAction<string[]>>
) => {
  setProjectIds((prev) => {
    if (prev.includes(id)) return prev.filter((p) => p !== id);

    if (role === 'Student' && prev.length >= 1) {
      // Replace if just 1 project allowed for Student
      return [id];
    }
    if (['Supervisor', 'Client'].includes(role) && prev.length >= 5) {
      return prev; // Ignore
    }
    return [...prev, id];
  });
};

export const handleNextStep3 = (
  role: string,
  projectIds: string[],
  setError: (err: string) => void,
  submitSetup: () => void
) => {
  if (role === 'Student' && projectIds.length !== 1) {
    setError('You must select exactly one project.');
    return;
  }
  if (
    ['Supervisor', 'Client'].includes(role) &&
    (projectIds.length === 0 || projectIds.length > 5)
  ) {
    setError('You must select between 1 and 5 projects.');
    return;
  }
  setError('');
  submitSetup();
};

export const submitSetup = async (
  fullName: string,
  role: string,
  projectIds: string[],
  setLoading: (loading: boolean) => void,
  setError: (err: string) => void,
  onComplete: (user: User) => void
) => {
  setLoading(true);
  setError('');
  try {
    const response = await SetupService.setupProfile({
      fullName,
      role,
      projectIds,
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
