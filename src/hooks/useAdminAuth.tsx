import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'moderator' | 'user';
    avatar?: string;
    createdAt: Date;
    lastLogin?: Date;
    isActive: boolean;
}

interface AdminAuthState {
    isAuthenticated: boolean;
    user: User | null;
}

const ADMIN_AUTH_KEY = 'admin-auth';
const USERS_KEY = 'users-data';

// Default admin credentials (in a real app, this would be in a database)
const DEFAULT_ADMIN: User = {
    id: 'admin-1',
    email: 'admin@entity-flow.com',
    name: 'Administrateur',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date(),
    isActive: true,
};

// Mock users for demo
const DEFAULT_USERS: User[] = [
    DEFAULT_ADMIN,
    {
        id: 'user-1',
        email: 'alice@example.com',
        name: 'Alice Martin',
        role: 'moderator',
        createdAt: new Date('2024-02-15'),
        lastLogin: new Date('2024-11-20'),
        isActive: true,
    },
    {
        id: 'user-2',
        email: 'bob@example.com',
        name: 'Bob Johnson',
        role: 'user',
        createdAt: new Date('2024-03-10'),
        lastLogin: new Date('2024-11-25'),
        isActive: true,
    },
    {
        id: 'user-3',
        email: 'claire@example.com',
        name: 'Claire Dupont',
        role: 'user',
        createdAt: new Date('2024-04-20'),
        lastLogin: new Date('2024-11-18'),
        isActive: true,
    },
    {
        id: 'user-4',
        email: 'david@example.com',
        name: 'David Chen',
        role: 'user',
        createdAt: new Date('2024-05-05'),
        isActive: false,
    },
];

function loadAuthState(): AdminAuthState {
    if (typeof window === 'undefined') {
        return { isAuthenticated: false, user: null };
    }

    const stored = localStorage.getItem(ADMIN_AUTH_KEY);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            return {
                ...parsed,
                user: parsed.user ? {
                    ...parsed.user,
                    createdAt: new Date(parsed.user.createdAt),
                    lastLogin: parsed.user.lastLogin ? new Date(parsed.user.lastLogin) : undefined,
                } : null,
            };
        } catch {
            return { isAuthenticated: false, user: null };
        }
    }
    return { isAuthenticated: false, user: null };
}

function saveAuthState(state: AdminAuthState) {
    localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(state));
}

function loadUsers(): User[] {
    if (typeof window === 'undefined') return DEFAULT_USERS;

    const stored = localStorage.getItem(USERS_KEY);
    if (stored) {
        try {
            return JSON.parse(stored).map((u: User) => ({
                ...u,
                createdAt: new Date(u.createdAt),
                lastLogin: u.lastLogin ? new Date(u.lastLogin) : undefined,
            }));
        } catch {
            return DEFAULT_USERS;
        }
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
}

function saveUsers(users: User[]) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

interface AdminAuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    users: User[];
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    updateUserRole: (userId: string, role: User['role']) => void;
    toggleUserActive: (userId: string) => void;
    deleteUser: (userId: string) => void;
    addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
    const [authState, setAuthState] = useState<AdminAuthState>(() => loadAuthState());
    const [users, setUsers] = useState<User[]>(() => loadUsers());

    useEffect(() => {
        saveAuthState(authState);
    }, [authState]);

    useEffect(() => {
        saveUsers(users);
    }, [users]);

    const login = useCallback(async (email: string, password: string): Promise<boolean> => {
        // Simulated authentication (in production, this would call an API)
        // Demo credentials: admin@entity-flow.com / admin123
        if (email === 'admin@entity-flow.com' && password === 'admin123') {
            const adminUser = users.find(u => u.email === email && u.role === 'admin');
            if (adminUser) {
                setAuthState({
                    isAuthenticated: true,
                    user: { ...adminUser, lastLogin: new Date() },
                });
                return true;
            }
        }
        return false;
    }, [users]);

    const logout = useCallback(() => {
        setAuthState({ isAuthenticated: false, user: null });
    }, []);

    const updateUserRole = useCallback((userId: string, role: User['role']) => {
        setUsers(prev => prev.map(u =>
            u.id === userId ? { ...u, role } : u
        ));
    }, []);

    const toggleUserActive = useCallback((userId: string) => {
        setUsers(prev => prev.map(u =>
            u.id === userId ? { ...u, isActive: !u.isActive } : u
        ));
    }, []);

    const deleteUser = useCallback((userId: string) => {
        setUsers(prev => prev.filter(u => u.id !== userId));
    }, []);

    const addUser = useCallback((userData: Omit<User, 'id' | 'createdAt'>) => {
        const newUser: User = {
            ...userData,
            id: `user-${Date.now()}`,
            createdAt: new Date(),
        };
        setUsers(prev => [...prev, newUser]);
    }, []);

    return (
        <AdminAuthContext.Provider value={{
            isAuthenticated: authState.isAuthenticated,
            user: authState.user,
            users,
            login,
            logout,
            updateUserRole,
            toggleUserActive,
            deleteUser,
            addUser,
        }}>
            {children}
        </AdminAuthContext.Provider>
    );
}

export function useAdminAuth() {
    const context = useContext(AdminAuthContext);
    if (!context) {
        throw new Error('useAdminAuth must be used within AdminAuthProvider');
    }
    return context;
}
