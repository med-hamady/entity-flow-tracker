import { useState } from 'react';
import { useAdminAuth, User } from '@/hooks/useAdminAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Users,
    Search,
    MoreVertical,
    UserPlus,
    Shield,
    UserCheck,
    UserX,
    Trash2,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

const roleLabels: Record<User['role'], string> = {
    admin: 'Administrateur',
    moderator: 'Modérateur',
    user: 'Utilisateur',
};

const roleBadgeColors: Record<User['role'], string> = {
    admin: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    moderator: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    user: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

export default function UsersManagementPage() {
    const { users, updateUserRole, toggleUserActive, deleteUser, addUser } = useAdminAuth();
    const [search, setSearch] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        role: 'user' as User['role'],
    });
    const { toast } = useToast();

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    const handleAddUser = () => {
        if (!newUser.name || !newUser.email) {
            toast({
                title: 'Erreur',
                description: 'Veuillez remplir tous les champs.',
                variant: 'destructive',
            });
            return;
        }
        addUser({ ...newUser, isActive: true });
        toast({
            title: 'Utilisateur ajouté',
            description: `${newUser.name} a été ajouté avec succès.`,
        });
        setNewUser({ name: '', email: '', role: 'user' });
        setDialogOpen(false);
    };

    const handleRoleChange = (userId: string, role: User['role']) => {
        updateUserRole(userId, role);
        toast({
            title: 'Rôle modifié',
            description: `Le rôle a été mis à jour avec succès.`,
        });
    };

    const handleToggleActive = (userId: string, isActive: boolean) => {
        toggleUserActive(userId);
        toast({
            title: isActive ? 'Utilisateur désactivé' : 'Utilisateur activé',
            description: `Le statut a été modifié avec succès.`,
        });
    };

    const handleDelete = (userId: string, userName: string) => {
        deleteUser(userId);
        toast({
            title: 'Utilisateur supprimé',
            description: `${userName} a été supprimé.`,
            variant: 'destructive',
        });
    };

    return (
        <div className="p-6 lg:p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Users className="h-8 w-8 text-indigo-400" />
                        Gestion des utilisateurs
                    </h1>
                    <p className="text-slate-400">
                        Gérez les comptes utilisateurs et leurs permissions
                    </p>
                </div>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                            <UserPlus className="h-4 w-4" />
                            Ajouter un utilisateur
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-800 border-slate-700">
                        <DialogHeader>
                            <DialogTitle className="text-white">Nouvel utilisateur</DialogTitle>
                            <DialogDescription className="text-slate-400">
                                Ajoutez un nouvel utilisateur à la plateforme.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-slate-300">Nom</Label>
                                <Input
                                    id="name"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    className="bg-slate-700 border-slate-600 text-white"
                                    placeholder="Jean Dupont"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-slate-300">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    className="bg-slate-700 border-slate-600 text-white"
                                    placeholder="jean@example.com"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="role" className="text-slate-300">Rôle</Label>
                                <Select value={newUser.role} onValueChange={(v: User['role']) => setNewUser({ ...newUser, role: v })}>
                                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-700 border-slate-600">
                                        <SelectItem value="user">Utilisateur</SelectItem>
                                        <SelectItem value="moderator">Modérateur</SelectItem>
                                        <SelectItem value="admin">Administrateur</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-slate-600 text-slate-300">
                                Annuler
                            </Button>
                            <Button onClick={handleAddUser} className="bg-indigo-600 hover:bg-indigo-700">
                                Ajouter
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search and Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-2 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                        placeholder="Rechercher un utilisateur..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 bg-slate-800 border-slate-700 text-white"
                    />
                </div>
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-400">Total</p>
                            <p className="text-2xl font-bold text-white">{users.length}</p>
                        </div>
                        <Users className="h-8 w-8 text-slate-500" />
                    </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-400">Actifs</p>
                            <p className="text-2xl font-bold text-green-400">{users.filter(u => u.isActive).length}</p>
                        </div>
                        <UserCheck className="h-8 w-8 text-green-500/50" />
                    </CardContent>
                </Card>
            </div>

            {/* Users Table */}
            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-white">Liste des utilisateurs</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-700 hover:bg-transparent">
                                <TableHead className="text-slate-400">Utilisateur</TableHead>
                                <TableHead className="text-slate-400">Rôle</TableHead>
                                <TableHead className="text-slate-400">Statut</TableHead>
                                <TableHead className="text-slate-400">Dernière connexion</TableHead>
                                <TableHead className="text-slate-400 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id} className="border-slate-700 hover:bg-slate-700/30">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">{user.name}</p>
                                                <p className="text-sm text-slate-400">{user.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={roleBadgeColors[user.role]}>
                                            {user.role === 'admin' && <Shield className="h-3 w-3 mr-1" />}
                                            {roleLabels[user.role]}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={user.isActive
                                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                                        }>
                                            {user.isActive ? 'Actif' : 'Inactif'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-slate-400">
                                        {user.lastLogin
                                            ? format(user.lastLogin, 'dd MMM yyyy', { locale: fr })
                                            : 'Jamais'
                                        }
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-700">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                                                <DropdownMenuLabel className="text-slate-300">Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator className="bg-slate-700" />
                                                <DropdownMenuItem
                                                    onClick={() => handleRoleChange(user.id, 'user')}
                                                    className="text-slate-300 focus:bg-slate-700 focus:text-white cursor-pointer"
                                                >
                                                    <UserX className="h-4 w-4 mr-2" /> Utilisateur
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleRoleChange(user.id, 'moderator')}
                                                    className="text-slate-300 focus:bg-slate-700 focus:text-white cursor-pointer"
                                                >
                                                    <UserCheck className="h-4 w-4 mr-2" /> Modérateur
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleRoleChange(user.id, 'admin')}
                                                    className="text-slate-300 focus:bg-slate-700 focus:text-white cursor-pointer"
                                                >
                                                    <Shield className="h-4 w-4 mr-2" /> Administrateur
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-slate-700" />
                                                <DropdownMenuItem
                                                    onClick={() => handleToggleActive(user.id, user.isActive)}
                                                    className="text-amber-400 focus:bg-amber-500/10 focus:text-amber-400 cursor-pointer"
                                                >
                                                    {user.isActive ? 'Désactiver' : 'Activer'}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(user.id, user.name)}
                                                    className="text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" /> Supprimer
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
