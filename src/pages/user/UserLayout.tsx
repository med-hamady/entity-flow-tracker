import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from '@/hooks/useUserAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    LayoutDashboard,
    FileText,
    LogOut,
    User,
    Settings,
    Bell,
    Check,
    X,
} from 'lucide-react';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface UserLayoutProps {
    children: ReactNode;
}

interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
}

const initialNotifications: Notification[] = [
    { id: '1', title: 'Entité validée', message: 'Votre document "Contrat 2024" a été validé', time: 'Il y a 10 min', read: false },
    { id: '2', title: 'Nouveau commentaire', message: 'Un modérateur a commenté votre entité', time: 'Il y a 2h', read: false },
];

export default function UserLayout({ children }: UserLayoutProps) {
    const { user, logout } = useUserAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const dismissNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    // Get display name (first_name + last_name or username)
    const displayName = user?.first_name
        ? `${user.first_name} ${user.last_name || ''}`.trim()
        : user?.username || 'Utilisateur';

    // Get initials for avatar
    const initials = user?.first_name
        ? `${user.first_name.charAt(0)}${user.last_name?.charAt(0) || ''}`
        : user?.username?.charAt(0).toUpperCase() || 'U';

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link to="/dashboard" className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                                <span className="text-sm font-bold text-white">EF</span>
                            </div>
                            <span className="text-lg font-semibold">Entity Flow</span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-1">
                            <Link to="/dashboard">
                                <Button variant="ghost" size="sm" className="gap-2">
                                    <LayoutDashboard className="h-4 w-4" />
                                    Dashboard
                                </Button>
                            </Link>
                            <Link to="/entities">
                                <Button variant="ghost" size="sm" className="gap-2">
                                    <FileText className="h-4 w-4" />
                                    Mes Entités
                                </Button>
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-3">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative">
                                    <Bell className="h-5 w-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-blue-600 text-[10px] font-medium text-white flex items-center justify-center">
                                            {unreadCount}
                                        </span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-0" align="end">
                                <div className="flex items-center justify-between p-4 border-b">
                                    <h3 className="font-semibold">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                                            Tout marquer comme lu
                                        </Button>
                                    )}
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="p-4 text-center text-muted-foreground">
                                            Aucune notification
                                        </div>
                                    ) : (
                                        notifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                className={cn(
                                                    "flex items-start gap-3 p-4 border-b hover:bg-muted/50 transition-colors",
                                                    !notification.read && "bg-blue-50"
                                                )}
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <p className={cn("text-sm font-medium", !notification.read && "text-blue-600")}>
                                                        {notification.title}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground truncate">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {notification.time}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {!notification.read && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6"
                                                            onClick={() => markAsRead(notification.id)}
                                                        >
                                                            <Check className="h-3 w-3" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                                        onClick={() => dismissNotification(notification.id)}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </PopoverContent>
                        </Popover>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="gap-2 px-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="hidden sm:inline text-sm font-medium">{displayName}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer">
                                    <User className="h-4 w-4 mr-2" />
                                    Profil
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                    <Settings className="h-4 w-4 mr-2" />
                                    Paramètres
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link to="/">Retour au site</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="text-red-600 focus:text-red-600 cursor-pointer"
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Déconnexion
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="container py-8">
                {children}
            </main>
        </div>
    );
}
