import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserAuth } from '@/hooks/useUserAuth';
import { useEntityStore } from '@/hooks/useEntityStore';
import { stateLabels } from '@/data/mockData';
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    FileText,
    Plus,
    Search,
    MoreVertical,
    Eye,
    Edit,
    Trash2,
    CheckCircle,
    Clock,
    XCircle,
    TrendingUp,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { EntityState, Entity } from '@/types/entity';
import UserLayout from './UserLayout';

const entityTypes = ['Document', 'Contrat', 'Facture', 'Rapport', 'Demande'];

const stateBadgeColors: Record<EntityState, string> = {
    draft: 'bg-slate-100 text-slate-700 border-slate-200',
    submitted: 'bg-amber-100 text-amber-700 border-amber-200',
    validated: 'bg-green-100 text-green-700 border-green-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
    archived: 'bg-purple-100 text-purple-700 border-purple-200',
};

export default function UserDashboard() {
    const { user } = useUserAuth();
    const { entities, addEntity, updateEntity, deleteEntity } = useEntityStore();
    const [search, setSearch] = useState('');
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
    const [editedEntity, setEditedEntity] = useState({ name: '', type: '' });
    const [newEntity, setNewEntity] = useState({ name: '', type: '', content: '' });
    const { toast } = useToast();

    // Get display name
    const displayName = user?.first_name || user?.username || 'Utilisateur';

    // Filter entities (in a real app, would filter by user ID)
    const userEntities = entities;
    const filteredEntities = userEntities.filter(entity =>
        entity.name.toLowerCase().includes(search.toLowerCase()) ||
        entity.type.toLowerCase().includes(search.toLowerCase())
    );

    const stats = {
        total: userEntities.length,
        validated: userEntities.filter(e => e.currentState === 'validated').length,
        pending: userEntities.filter(e => e.currentState === 'submitted').length,
        draft: userEntities.filter(e => e.currentState === 'draft').length,
    };

    const handleCreateEntity = () => {
        if (!newEntity.name || !newEntity.type || !newEntity.content) {
            toast({ title: 'Erreur', description: 'Veuillez remplir tous les champs.', variant: 'destructive' });
            return;
        }
        const authorName = user?.first_name
            ? `${user.first_name} ${user.last_name || ''}`.trim()
            : user?.username || 'Utilisateur';
        addEntity({ ...newEntity, author: authorName });
        toast({ title: 'Entité créée', description: `"${newEntity.name}" a été créée avec succès.` });
        setNewEntity({ name: '', type: '', content: '' });
        setCreateDialogOpen(false);
    };

    const handleDeleteEntity = (entity: Entity) => {
        deleteEntity(entity.id);
        toast({ title: 'Entité supprimée', description: `"${entity.name}" a été supprimée.`, variant: 'destructive' });
    };

    const handleEditEntity = (entity: Entity) => {
        setSelectedEntity(entity);
        setEditedEntity({ name: entity.name, type: entity.type });
        setEditDialogOpen(true);
    };

    const handleSaveEdit = () => {
        if (!selectedEntity) return;
        if (!editedEntity.name || !editedEntity.type) {
            toast({ title: 'Erreur', description: 'Veuillez remplir tous les champs.', variant: 'destructive' });
            return;
        }
        updateEntity(selectedEntity.id, editedEntity);
        toast({ title: 'Entité modifiée', description: 'Les modifications ont été sauvegardées.' });
        setEditDialogOpen(false);
    };

    return (
        <UserLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Bonjour, {displayName} 👋</h1>
                        <p className="text-muted-foreground mt-1">
                            Voici un aperçu de vos entités
                        </p>
                    </div>

                    <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                                <Plus className="h-4 w-4" />
                                Nouvelle entité
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Créer une nouvelle entité</DialogTitle>
                                <DialogDescription>
                                    Remplissez les informations pour créer une nouvelle entité.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nom</Label>
                                    <Input
                                        id="name"
                                        placeholder="Ex: Contrat 2024"
                                        value={newEntity.name}
                                        onChange={(e) => setNewEntity({ ...newEntity, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="type">Type</Label>
                                    <Select value={newEntity.type} onValueChange={(v) => setNewEntity({ ...newEntity, type: v })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionnez un type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {entityTypes.map((t) => (
                                                <SelectItem key={t} value={t}>{t}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="content">Description</Label>
                                    <Textarea
                                        id="content"
                                        placeholder="Décrivez votre entité..."
                                        value={newEntity.content}
                                        onChange={(e) => setNewEntity({ ...newEntity, content: e.target.value })}
                                        rows={3}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Annuler</Button>
                                <Button onClick={handleCreateEntity}>Créer</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total entités</p>
                                    <p className="text-3xl font-bold text-blue-600 mt-1">{stats.total}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <FileText className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-emerald-50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Validées</p>
                                    <p className="text-3xl font-bold text-green-600 mt-1">{stats.validated}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-yellow-50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">En attente</p>
                                    <p className="text-3xl font-bold text-amber-600 mt-1">{stats.pending}</p>
                                </div>
                                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                                    <Clock className="h-6 w-6 text-amber-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-violet-50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Brouillons</p>
                                    <p className="text-3xl font-bold text-purple-600 mt-1">{stats.draft}</p>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <TrendingUp className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Entity Table */}
                <Card className="border-0 shadow-sm">
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <CardTitle>Mes entités</CardTitle>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        {filteredEntities.length === 0 ? (
                            <div className="text-center py-12">
                                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">Aucune entité trouvée</p>
                                <Button variant="outline" className="mt-4" onClick={() => setCreateDialogOpen(true)}>
                                    Créer votre première entité
                                </Button>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nom</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>État</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredEntities.map((entity) => (
                                        <TableRow key={entity.id}>
                                            <TableCell className="font-medium">{entity.name}</TableCell>
                                            <TableCell>{entity.type}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={stateBadgeColors[entity.currentState]}>
                                                    {stateLabels[entity.currentState]}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{format(entity.createdAt, 'dd MMM yyyy', { locale: fr })}</TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild className="cursor-pointer">
                                                            <Link to={`/entities/${entity.id}`}>
                                                                <Eye className="h-4 w-4 mr-2" /> Voir
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleEditEntity(entity)} className="cursor-pointer">
                                                            <Edit className="h-4 w-4 mr-2" /> Modifier
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleDeleteEntity(entity)}
                                                            className="text-red-600 focus:text-red-600 cursor-pointer"
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
                        )}
                    </CardContent>
                </Card>

                {/* Edit Dialog */}
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Modifier l'entité</DialogTitle>
                            <DialogDescription>
                                Modifiez les informations de "{selectedEntity?.name}"
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Nom</Label>
                                <Input
                                    value={editedEntity.name}
                                    onChange={(e) => setEditedEntity({ ...editedEntity, name: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Type</Label>
                                <Select
                                    value={editedEntity.type}
                                    onValueChange={(v) => setEditedEntity({ ...editedEntity, type: v })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {entityTypes.map((t) => (
                                            <SelectItem key={t} value={t}>{t}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Annuler</Button>
                            <Button onClick={handleSaveEdit}>Sauvegarder</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </UserLayout>
    );
}
