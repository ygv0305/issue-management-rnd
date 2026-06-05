// Node modules
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

// Services
import AuthService from '../../services/authService';

// Lib
import { useUser } from '../../lib/context/UserContext';

// Utils
import { isValidEmail } from '../../utils/checkValidEmail';

type AuthMode = 'login' | 'signup' | 'reset';

interface UseAuthReturn {
  authMode: AuthMode;
  email: string;
  password: string;
  error: string;
  isLoading: boolean;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  authModeChange: (mode: AuthMode) => void;
  handleSubmit: (e: React.SubmitEvent) => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user, loading: userLoading, checkAuth } = useUser();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (!userLoading && user) {
      navigate('/my-issues');
    }
  }, [user, userLoading, navigate]);

  const authMutation = useMutation({
    mutationFn: async () => {
      if (authMode === 'login') {
        const res = await AuthService.requestLogin({ email, password });
        localStorage.setItem('accessToken', res.accessToken!);
        await checkAuth();
      } else if (authMode === 'signup') {
        const res = await AuthService.register({ email });
        alert(res.message || 'Check your email for the verification link.');
        authModeChange('login');
      } else if (authMode === 'reset') {
        const res = await AuthService.forgotPassword({ email });
        alert(res.message || 'A reset link has been sent to your email.');
        authModeChange('login');
      }
    },
    onError: (error: AxiosError<{ message?: string; code?: string }>) => {
      if (
        authMode === 'signup' &&
        error.response?.data?.code === 'UserNotFound'
      ) {
        alert(
          'You are not authorised for this course. Contact your paper leader if you think it is a mistake.',
        );
      } else {
        const message =
          error.response?.data?.message ||
          error.message ||
          'An unexpected error occurred';
        setError(message);
      }
    },
  });

  const authModeChange = (mode: AuthMode) => {
    setAuthMode(mode);
    setError('');
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (authMutation.isPending) return;
    setError('');

    if (!email.trim()) {
      setError('Email cannot be empty.');
      return;
    }

    if (authMode === 'login' && !password.trim()) {
      setError('Password cannot be empty.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('You must use a valid @autuni.ac.nz address.');
      return;
    }

    if (authMode === 'login' && password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    authMutation.mutate();
  };

  return {
    authMode,
    email,
    password,
    error,
    isLoading: authMutation.isPending,
    setEmail,
    setPassword,
    authModeChange,
    handleSubmit,
  };
};
