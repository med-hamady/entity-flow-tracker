import { api, setTokens, clearTokens, getRefreshToken } from './api';

// Types
export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: 'admin' | 'moderator' | 'user';
    is_active: boolean;
    date_joined: string;
    created_at: string;
}

export interface AuthResponse {
    user: User;
    tokens: {
        access: string;
        refresh: string;
    };
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
    password_confirm: string;
    first_name?: string;
    last_name?: string;
}

export interface LoginData {
    username: string;
    password: string;
}

export interface ProfileUpdateData {
    first_name?: string;
    last_name?: string;
    email?: string;
}

// Auth API Service
export const authApi = {
    // Register new user
    register: async (data: RegisterData): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/register/', data);
        setTokens(response.tokens.access, response.tokens.refresh);
        localStorage.setItem('user', JSON.stringify(response.user));
        return response;
    },

    // Login user
    login: async (data: LoginData): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login/', data);
        setTokens(response.tokens.access, response.tokens.refresh);
        localStorage.setItem('user', JSON.stringify(response.user));
        return response;
    },

    // Admin login
    adminLogin: async (data: LoginData): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/admin/login/', data);
        setTokens(response.tokens.access, response.tokens.refresh);
        localStorage.setItem('user', JSON.stringify(response.user));
        return response;
    },

    // Logout
    logout: async (): Promise<void> => {
        try {
            const refreshToken = getRefreshToken();
            if (refreshToken) {
                await api.post('/auth/logout/', { refresh: refreshToken });
            }
        } catch {
            // Ignore errors, just clear tokens
        } finally {
            clearTokens();
        }
    },

    // Get current user profile
    getProfile: async (): Promise<User> => {
        const user = await api.get<User>('/auth/me/');
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    },

    // Update profile
    updateProfile: async (data: ProfileUpdateData): Promise<User> => {
        const user = await api.put<User>('/auth/me/', data);
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    },
};
