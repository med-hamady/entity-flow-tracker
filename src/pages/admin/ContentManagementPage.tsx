import { useState } from 'react';
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    FileText,
    Search,
    MoreVertical,
    Eye,
    CheckCircle,
    XCircle,
    Archive,
    Trash2,
    Plus,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { EntityState } from '@/types/entity';

const stateBadgeColors: Record<EntityState, string> = {
    draft: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    submitted: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    validated: 'bg-green-500/20 text-green-400 border-green-500/30',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
    archived: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

export default function ContentManagementPage() {
    const { entities, updateEntityState, deleteEntity } = useEntityStore();
    const [search, setSearch] = useState('');
    const { toast } = useToast();

    const filteredEntities = entities.filter(entity =>
        entity.name.toLowerCase().includes(search.toLowerCase()) ||
        entity.type.toLowerCase().includes(search.toLowerCase())
    );

    const handleStateChange = (entityId: string, newState: EntityState) => {
        updateEntityState(entityId, newState, 'Admin');
        toast({
            title: 'État modifié',
            description: `L'entité a été mise à jour vers "${stateLabels[newState]}".`,
        });
    };

    const handleDelete = (entityId: string, entityName: string) => {
        deleteEntity(entityId);
        toast({
            title: 'Entité supprimée',
            description: `${entityName} a été supprimée.`,
            variant: 'destructive',
        });
    };

    return (
        <div className="p-6 lg:p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <FileText className="h-8 w-8 text-purple-400" />
                        Gestion du contenu
                    </h1>
                    <p className="text-slate-400">
                        Gérez et modérez le contenu de la plateforme
                    </p>
                </div>

                <Link to="/entities">
                    <Button className="bg-purple-600 hover:bg-purple-700 gap-2">
                        <Plus className="h-4 w-4" />
                        Créer une entité
                    </Button>
                </Link>
            </div>

            {/* Search and Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                <div className="sm:col-span-2 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                        placeholder="Rechercher une entité..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 bg-slate-800 border-slate-700 text-white"
                    />
                </div>
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-400">Total</p>
                            <p className="text-2xl font-bold text-white">{entities.length}</p>
                        </div>
                        <FileText className="h-8 w-8 text-slate-500" />
                    </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-400">Validées</p>
                            <p className="text-2xl font-bold text-green-400">{entities.filter(e => e.currentState === 'validated').length}</p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-500/50" />
                    </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-400">En attente</p>
                            <p className="text-2xl font-bold text-amber-400">{entities.filter(e => e.currentState === 'submitted').length}</p>
                        </div>
                        <XCircle className="h-8 w-8 text-amber-500/50" />
                    </CardContent>
                </Card>
            </div>

            {/* Content Table */}
            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-white">Liste des entités</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-700 hover:bg-transparent">
                                <TableHead className="text-slate-400">Entité</TableHead>
                                <TableHead className="text-slate-400">Type</TableHead>
                                <TableHead className="text-slate-400">État</TableHead>
                                <TableHead className="text-slate-400">Créée le</TableHead>
                                <TableHead className="text-slate-400">Versions</TableHead>
                                <TableHead className="text-slate-400 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredEntities.map((entity) => (
                                <TableRow key={entity.id} className="border-slate-700 hover:bg-slate-700/30">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                                                <FileText className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">{entity.name}</p>
                                                <p className="text-sm text-slate-400">ID: {entity.id}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-300">{entity.type}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={stateBadgeColors[entity.currentState]}>
                                            {stateLabels[entity.currentState]}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-slate-400">
                                        {format(entity.createdAt, 'dd MMM yyyy', { locale: fr })}
                                    </TableCell>
                                    <TableCell className="text-slate-400">{entity.versions.length}</TableCell>
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
                                                <DropdownMenuItem asChild className="text-slate-300 focus:bg-slate-700 focus:text-white cursor-pointer">
                                                    <Link to={`/entities/${entity.id}`}>
                                                        <Eye className="h-4 w-4 mr-2" /> Voir les détails
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-slate-700" />
                                                <DropdownMenuItem
                                                    onClick={() => handleStateChange(entity.id, 'validated')}
                                                    className="text-green-400 focus:bg-green-500/10 focus:text-green-400 cursor-pointer"
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-2" /> Valider
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleStateChange(entity.id, 'rejected')}
                                                    className="text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer"
                                                >
                                                    <XCircle className="h-4 w-4 mr-2" /> Rejeter
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleStateChange(entity.id, 'archived')}
                                                    className="text-purple-400 focus:bg-purple-500/10 focus:text-purple-400 cursor-pointer"
                                                >
                                                    <Archive className="h-4 w-4 mr-2" /> Archiver
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-slate-700" />
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(entity.id, entity.name)}
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
