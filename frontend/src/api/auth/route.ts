import axiosInstance from '../axiosInstance';
import {
  RegisterUserPayload,
  User,
  LoginResponse,
  TokenResponse,
  MessageResponse
} from '@/types/auth';

interface LoginForm {
  username: string;
  password: string;
}

interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}

const registerUser = async (userData: RegisterUserPayload): Promise<User> => {
  const response = await axiosInstance.post<User>('/api/auth/register', userData);
  return response.data;
};

const login = async (loginData: LoginForm): Promise<LoginResponse> => {
  const formData = new URLSearchParams();
  formData.append('username', loginData.username);
  formData.append('password', loginData.password);

  const response = await axiosInstance.post<LoginResponse>('/api/auth/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  return response.data;
};

const refreshToken = async (refreshToken: string): Promise<TokenResponse> => {
  const response = await axiosInstance.post<TokenResponse>('/api/auth/token/refresh', { refresh_token: refreshToken });
  return response.data;
};

const changePassword = async (payload: ChangePasswordPayload): Promise<MessageResponse> => {
  const response = await axiosInstance.post<MessageResponse>('/api/auth/change-password', payload);
  return response.data;
};

const logout = async (): Promise<MessageResponse> => {
  const response = await axiosInstance.post<MessageResponse>('/api/auth/logout');
  return response.data;
};

export {
  registerUser,
  login,
  refreshToken,
  changePassword,
  logout
};
