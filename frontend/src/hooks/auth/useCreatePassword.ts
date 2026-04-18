// Node modules
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

// Services
import AuthService from '../../services/authService';

interface UseCreatePasswordReturn {
  email: string | null;
  token: string | null;
  password: string;
  confirmPassword: string;
  error: string;
  success: boolean;
  isLoading: boolean;
  isReset: boolean;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  handleSubmit: (e: React.SubmitEvent) => Promise<void>;
}

export const useCreatePassword = (): UseCreatePasswordReturn => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !email) {
      navigate('/');
    }
  }, [token, email, navigate]);

  const passwordMutation = useMutation({
    mutationFn: async () => {
      if (!email || !token) throw new Error('Missing email or token.');
      await AuthService.setPassword({ email, token, password });
    },
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => navigate('/'), 1000);
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      const message =
        err.response?.data?.message ||
        err.message ||
        'An unexpected error occurred';
      setError(message);
    },
  });

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (passwordMutation.isPending) return;
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    passwordMutation.mutate();
  };

  // Determine if it looks like a reset or create flow based on URL path
  const isReset = window.location.pathname.includes('reset-password');

  return {
    email,
    token,
    password,
    confirmPassword,
    error,
    success,
    isLoading: passwordMutation.isPending,
    isReset,
    setPassword,
    setConfirmPassword,
    handleSubmit,
  };
};
