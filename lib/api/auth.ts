import apiClient from './client';
import { Customer, AuthResponse, LoginCredentials, RegisterData, UpdateProfileData } from '@/types/customer';

export const authApi = {
    // Register new user
    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await apiClient.post('/api/auth/register', data);
        const responseData = response.data;
        // Ensure user object has id instead of _id
        if (responseData.user && responseData.user._id) {
            responseData.user.id = responseData.user._id;
        }
        return responseData;
    },

    // Login
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await apiClient.post('/api/auth/login', credentials);
        const data = response.data;
        // Ensure user object has id instead of _id
        if (data.user && data.user._id) {
            data.user.id = data.user._id;
        }
        return data;
    },

    // Refresh token
    async refresh(refreshToken: string): Promise<{ accessToken: string }> {
        const response = await apiClient.post('/api/auth/refresh', { refreshToken });
        return response.data;
    },

    // Get current user
    async me(): Promise<Customer> {
        const response = await apiClient.get('/api/auth/me');
        // Backend returns { user: {...} }, extract user and map _id to id
        const userData = response.data.user || response.data;
        return {
            ...userData,
            id: userData._id || userData.id,
        };
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
