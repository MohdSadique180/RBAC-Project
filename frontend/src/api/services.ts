import api from './axios';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types';

export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/api/auth/register', data);
    return res.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/api/auth/login', data);
    return res.data;
  },
};

export const contentApi = {
  getPublic: async (): Promise<{ message: string; access: string }> => {
    const res = await api.get('/api/public');
    return res.data;
  },

  getUserContent: async (): Promise<{ message: string; access: string }> => {
    const res = await api.get('/api/user');
    return res.data;
  },

  getAdminContent: async (): Promise<{ message: string; access: string }> => {
    const res = await api.get('/api/admin');
    return res.data;
  },
};
