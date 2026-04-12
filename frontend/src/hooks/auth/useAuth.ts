// Node modules
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

// Services
import AuthService from '../../services/authService';

// Context
import { useUser } from '../../lib/context/UserContext';

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

const isValidEmail = (email: string): boolean =>
  email.endsWith('@autuni.ac.nz');

export const useAuth = (): UseAuthReturn => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, loading: userLoading, checkAuth } = useUser();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (!userLoading && user) {
      navigate('/my-issues');
    }
  }, [user, userLoading, navigate]);

  const authModeChange = (mode: AuthMode) => {
    setAuthMode(mode);
    setError('');
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setError('');
    setIsLoading(true);

    if (!email.trim()) {
      setError('Email cannot be empty.');
      setIsLoading(false);
      return;
    }

    if (authMode === 'login' && !password.trim()) {
      setError('Password cannot be empty.');
      setIsLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      setError('You must use a valid @autuni.ac.nz address.');
      setIsLoading(false);
      return;
    }

    if (authMode === 'login' && password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setIsLoading(false);
      return;
    }

    try {
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
    } catch (error: unknown) {
      if (
        authMode === 'signup' &&
        (error as { response?: { data?: { code?: string } } })?.response?.data
          ?.code === 'UserNotFound'
      ) {
        alert(
          'You are not authorised for this course. Contact your paper leader if you think it is a mistake.',
        );
      } else {
        const err = error as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        const message =
          err.response?.data?.message ||
          err.message ||
          'An unexpected error occurred';
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    authMode,
    email,
    password,
    error,
    isLoading,
    setEmail,
    setPassword,
    authModeChange,
    handleSubmit,
  };
};
