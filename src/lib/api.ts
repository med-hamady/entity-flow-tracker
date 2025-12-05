// API Base Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Token management
export const getAccessToken = () => localStorage.getItem('access_token');
export const getRefreshToken = () => localStorage.getItem('refresh_token');
export const setTokens = (access: string, refresh: string) => {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
};
export const clearTokens = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
};

// API Error class
export class ApiError extends Error {
    status: number;
    data: Record<string, unknown>;

    constructor(message: string, status: number, data: Record<string, unknown> = {}) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

// Refresh token function
async function refreshAccessToken(): Promise<string | null> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;

    try {
        const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        if (!response.ok) {
            clearTokens();
            return null;
        }

        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        return data.access;
    } catch {
        clearTokens();
        return null;
    }
}

// Main API request function
export async function apiRequest<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getAccessToken();

    const config: RequestInit = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    };

    let response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // If 401, try to refresh token
    if (response.status === 401 && token) {
        const newToken = await refreshAccessToken();
        if (newToken) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${newToken}`,
            };
            response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        } else {
            // Redirect to login
            window.location.href = '/login';
            throw new ApiError('Session expirée', 401);
        }
    }

    if (!response.ok) {
        let errorData: Record<string, unknown> = {};
        try {
            errorData = await response.json();
        } catch {
            // Response might not be JSON
        }

        const errorMessage =
            (errorData.error as string) ||
            (errorData.message as string) ||
            (errorData.detail as string) ||
            'Une erreur est survenue';

        throw new ApiError(errorMessage, response.status, errorData);
    }

    // Handle empty responses
    const text = await response.text();
    if (!text) return {} as T;

    return JSON.parse(text) as T;
}

// HTTP method shortcuts
export const api = {
    get: <T = unknown>(endpoint: string) =>
        apiRequest<T>(endpoint, { method: 'GET' }),

    post: <T = unknown>(endpoint: string, data?: unknown) =>
        apiRequest<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined
        }),

    put: <T = unknown>(endpoint: string, data?: unknown) =>
        apiRequest<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined
        }),

    patch: <T = unknown>(endpoint: string, data?: unknown) =>
        apiRequest<T>(endpoint, {
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined
        }),

    delete: <T = unknown>(endpoint: string) =>
        apiRequest<T>(endpoint, { method: 'DELETE' }),
};
