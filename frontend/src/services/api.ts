import axios from 'axios';
import { User, CreateUserRequest, UpdateUserRequest, OnboardingConfig, UpdateConfigRequest } from '../types';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User API
export const userAPI = {
  createUser: async (data: CreateUserRequest): Promise<User> => {
    const response = await api.post('/users', data);
    return response.data;
  },

  updateUser: async (id: string, data: UpdateUserRequest): Promise<User> => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  getOnboardingConfig: async (): Promise<{ page2: OnboardingConfig[], page3: OnboardingConfig[] }> => {
    const response = await api.get('/admin/config');
    return response.data;
  },

  updateOnboardingConfig: async (data: UpdateConfigRequest): Promise<OnboardingConfig[]> => {
    const response = await api.put('/admin/config', data);
    return response.data;
  },

  initializeDefaultConfig: async (): Promise<OnboardingConfig[]> => {
    const response = await api.post('/admin/config/init');
    return response.data;
  },
};

export default api; 