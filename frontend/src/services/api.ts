import axios from 'axios';
import { User, CreateUserRequest, UpdateUserRequest, OnboardingConfig, UpdateConfigRequest } from '../types';

// Smart API URL detection for different environments
const getApiBaseUrl = () => {
  // If environment variable is set, use it
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // If running in browser and on localhost, use local backend
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:5001/api';
  }
  
  // Use the same domain for API calls (backend will be deployed to the same domain)
  return '/api';
};

const API_BASE_URL = getApiBaseUrl();

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

  getAllUsers: async (sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<User[]> => {
    const params = new URLSearchParams();
    if (sortBy) params.append('sortBy', sortBy);
    if (sortOrder) params.append('sortOrder', sortOrder);
    
    const response = await api.get(`/users?${params.toString()}`);
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