// API
import api from '../lib/api/axios';
import apiAuth from '../lib/api/axiosAuth';

// Types
import type {
  LoginCredentials,
  RegisterCredentials,
  ForgotPasswordCredentials,
  SetPasswordCredentials,
  AuthResponse,
  BaseResponse,
} from '../types/authTypes';

class AuthService {
  async requestLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      '/auth/request-login',
      credentials,
      {
        withCredentials: true,
      },
    );
    return response.data;
  }

  async autoLogin(): Promise<AuthResponse> {
    const response = await apiAuth.post<AuthResponse>('/auth/auto-login');
    return response.data;
  }

  async register(credentials: RegisterCredentials): Promise<BaseResponse> {
    const response = await api.post<BaseResponse>(
      '/auth/register',
      credentials,
    );
    return response.data;
  }

  async forgotPassword(
    credentials: ForgotPasswordCredentials,
  ): Promise<BaseResponse> {
    const response = await api.post<BaseResponse>(
      '/auth/forgot-password',
      credentials,
    );
    return response.data;
  }

  async setPassword(
    credentials: SetPasswordCredentials,
  ): Promise<BaseResponse> {
    const response = await api.post<BaseResponse>(
      '/auth/set-password',
      credentials,
    );
    return response.data;
  }

  async logout(): Promise<void> {
    await apiAuth.post('/auth/logout');
  }
}

export default new AuthService();
