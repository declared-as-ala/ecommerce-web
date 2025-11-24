// Customer/User types matching backend model
export interface Customer {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    active: boolean;
    loyaltyPoints?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: Customer;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
}

export interface UpdateProfileData {
    firstName?: string;
    lastName?: string;
    phone?: string;
}
