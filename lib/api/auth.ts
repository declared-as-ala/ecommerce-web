import apiClient from './client';
import { Customer, AuthResponse, LoginCredentials, RegisterData, UpdateProfileData } from '@/types/customer';

export const authApi = {
    // Register new user
    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await apiClient.post('/api/auth/register', data);
        const responseData = response.data;
        // Ensure user object has id mapped from _id
        if (responseData.user) {
            responseData.user = {
                ...responseData.user,
                id: responseData.user._id || responseData.user.id,
            };
        }
        return responseData;
    },

    // Login
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await apiClient.post('/api/auth/login', credentials);
        const responseData = response.data;
        // Ensure user object has id mapped from _id
        if (responseData.user) {
            responseData.user = {
                ...responseData.user,
                id: responseData.user._id || responseData.user.id,
            };
        }
        return responseData;
    },

    // Refresh token
    async refresh(refreshToken: string): Promise<{ accessToken: string }> {
        const response = await apiClient.post('/api/auth/refresh', { refreshToken });
        return response.data;
    },

    // Get current user
    async me(): Promise<Customer> {
        const response = await apiClient.get('/api/auth/me');
        const userData = response.data.user || response.data;
        // Map _id to id to match Customer type
        return {
            ...userData,
            id: userData._id || userData.id,
        };
    },

    // Update profile
    async updateProfile(data: UpdateProfileData): Promise<Customer> {
        const response = await apiClient.put('/api/profile', data);
        const userData = response.data.user || response.data;
        // Map _id to id to match Customer type
        return {
            ...userData,
            id: userData._id || userData.id,
        };
    },

    // Forgot password
    async forgotPassword(email: string): Promise<{ message: string }> {
        const response = await apiClient.post('/api/auth/forgot', { email });
        return response.data;
    },
};
