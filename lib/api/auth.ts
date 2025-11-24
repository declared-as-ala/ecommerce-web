import apiClient from './client';
import { Customer, AuthResponse, LoginCredentials, RegisterData, UpdateProfileData } from '@/types/customer';

export const authApi = {
    // Register new user
    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await apiClient.post('/api/auth/register', data);
        return response.data;
    },

    // Login
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await apiClient.post('/api/auth/login', credentials);
        return response.data;
    },

    // Refresh token
    async refresh(refreshToken: string): Promise<{ accessToken: string }> {
        const response = await apiClient.post('/api/auth/refresh', { refreshToken });
        return response.data;
    },

    // Get current user
    async me(): Promise<Customer> {
        const response = await apiClient.get('/api/auth/me');
        return response.data;
    },

    // Update profile
    async updateProfile(data: UpdateProfileData): Promise<Customer> {
        const response = await apiClient.put('/api/profile', data);
        return response.data;
    },

    // Forgot password
    async forgotPassword(email: string): Promise<{ message: string }> {
        const response = await apiClient.post('/api/auth/forgot', { email });
        return response.data;
    },
};
