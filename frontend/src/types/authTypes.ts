export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterCredentials {
  email: string;
}

export interface ForgotPasswordCredentials {
  email: string;
}

export interface SetPasswordCredentials {
  email: string;
  token: string;
  password?: string;
}

export interface AuthResponse {
  message?: string;
  success?: boolean;
  accessToken?: string;
}

export interface BaseResponse {
  message: string;
}
