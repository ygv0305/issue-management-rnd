// API
import api from '../lib/api/axios';
import apiAuth from '../lib/api/axiosAuth';

// Types
import type * as AuthTypes from '../types/authTypes';

class AuthService {
  async requestLogin(
    credentials: AuthTypes.LoginCredentials,
  ): Promise<AuthTypes.AuthResponse> {
    const response = await api.post<AuthTypes.AuthResponse>(
      '/auth/request-login',
      credentials,
      { withCredentials: true },
    );
    return response.data;
  }

  async autoLogin(): Promise<AuthTypes.AuthResponse> {
    const response =
      await apiAuth.post<AuthTypes.AuthResponse>('/auth/auto-login');
    return response.data;
  }

  async register(
    credentials: AuthTypes.RegisterCredentials,
  ): Promise<AuthTypes.AuthResponse> {
    const response = await api.post<AuthTypes.AuthResponse>(
      '/auth/register',
      credentials,
    );
    return response.data;
  }

  async forgotPassword(
    credentials: AuthTypes.RegisterCredentials,
  ): Promise<AuthTypes.BaseResponse> {
    const response = await api.post<AuthTypes.BaseResponse>(
      '/auth/forgot-password',
      credentials,
    );
    return response.data;
  }

  async setPassword(
    credentials: AuthTypes.SetPasswordCredentials,
  ): Promise<AuthTypes.AuthResponse> {
    const response = await api.post<AuthTypes.AuthResponse>(
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
