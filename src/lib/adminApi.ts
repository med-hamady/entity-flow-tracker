import { api } from './api';
import { User } from './authApi';

// Users API Service (Admin only)
export const usersApi = {
    // Get all users
    getAll: async (): Promise<User[]> => {
        return api.get<User[]>('/users/');
    },

    // Get single user
    getById: async (id: number): Promise<User> => {
        return api.get<User>(`/users/${id}/`);
    },

    // Create user
    create: async (data: {
        username: string;
        email: string;
        password: string;
        first_name?: string;
        last_name?: string;
        role?: string;
    }): Promise<User> => {
        return api.post<User>('/users/', data);
    },

    // Update user
    update: async (id: number, data: Partial<User>): Promise<User> => {
        return api.put<User>(`/users/${id}/`, data);
    },

    // Delete user
    delete: async (id: number): Promise<void> => {
        await api.delete(`/users/${id}/`);
    },

    // Change user role
    changeRole: async (id: number, role: 'admin' | 'moderator' | 'user'): Promise<User> => {
        return api.patch<User>(`/users/${id}/role/`, { role });
    },

    // Toggle user active status
    toggleActive: async (id: number): Promise<User> => {
        return api.patch<User>(`/users/${id}/toggle-active/`, {});
    },
};

// Statistics API Types
export interface DashboardStats {
    total_users: number;
    active_users: number;
    total_entities: number;
    validated_entities: number;
    rejected_entities: number;
    pending_entities: number;
}

export interface EntityStats {
    draft: number;
    submitted: number;
    validated: number;
    rejected: number;
    archived: number;
}

export interface MonthlyData {
    month: string;
    entities: number;
    users: number;
}

export interface TypeStats {
    name: string;
    value: number;
}

// Statistics API Service
export const statsApi = {
    // Get dashboard stats
    getDashboard: async (): Promise<DashboardStats> => {
        return api.get<DashboardStats>('/stats/dashboard/');
    },

    // Get entity stats by state
    getEntityStats: async (): Promise<EntityStats> => {
        return api.get<EntityStats>('/stats/entities/');
    },

    // Get monthly evolution
    getMonthly: async (): Promise<MonthlyData[]> => {
        return api.get<MonthlyData[]>('/stats/monthly/');
    },

    // Get stats by entity type
    getByType: async (): Promise<TypeStats[]> => {
        return api.get<TypeStats[]>('/stats/by-type/');
    },

    // Get stats by author
    getByAuthor: async (): Promise<TypeStats[]> => {
        return api.get<TypeStats[]>('/stats/by-author/');
    },
};

// Settings API Types
export interface SiteSettings {
    site_name: string;
    site_description: string;
    contact_email: string;
    enable_notifications: boolean;
    enable_email_alerts: boolean;
    maintenance_mode: boolean;
    require_approval: boolean;
    max_file_size: number;
    session_timeout: number;
}

// Settings API Service
export const settingsApi = {
    // Get settings
    get: async (): Promise<SiteSettings> => {
        return api.get<SiteSettings>('/settings/');
    },

    // Update settings
    update: async (data: Partial<SiteSettings>): Promise<SiteSettings> => {
        return api.put<SiteSettings>('/settings/', data);
    },
};
