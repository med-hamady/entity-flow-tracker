import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { getAccessToken, clearTokens } from '@/lib/api';
import { authApi, User } from '@/lib/authApi';

interface UserAuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const UserAuthContext = createContext<UserAuthContextType | null>(null);

export function UserAuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const loadUser = () => {
            const token = getAccessToken();
            const storedUser = localStorage.getItem('user');

            if (token && storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch {
                    clearTokens();
                }
            }
            setLoading(false);
        };

        loadUser();
    }, []);

    const logout = useCallback(async () => {
        try {
            await authApi.logout();
        } catch {
            // Ignore errors
        } finally {
            setUser(null);
            clearTokens();
        }
    }, []);

    const refreshUser = useCallback(async () => {
        try {
            const userData = await authApi.getProfile();
            setUser(userData);
        } catch {
            setUser(null);
            clearTokens();
        }
    }, []);

    return (
        <UserAuthContext.Provider value={{
            isAuthenticated: !!user && !!getAccessToken(),
            user,
            loading,
            logout,
            refreshUser,
        }}>
            {children}
        </UserAuthContext.Provider>
    );
}

export function useUserAuth() {
    const context = useContext(UserAuthContext);
    if (!context) {
        throw new Error('useUserAuth must be used within UserAuthProvider');
    }
    return context;
}
