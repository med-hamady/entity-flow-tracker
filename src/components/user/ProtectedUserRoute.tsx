import { Navigate } from 'react-router-dom';
import { useUserAuth } from '@/hooks/useUserAuth';
import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ProtectedUserRouteProps {
    children: ReactNode;
}

export function ProtectedUserRoute({ children }: ProtectedUserRouteProps) {
    const { isAuthenticated, loading } = useUserAuth();

    // Show loading spinner while checking auth
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
