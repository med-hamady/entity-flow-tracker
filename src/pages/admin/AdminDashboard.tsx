import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useEntityStore } from '@/hooks/useEntityStore';
import {
    Users,
    FileText,
    CheckCircle,
    XCircle,
    Clock,
    TrendingUp,
    Activity,
    AlertTriangle,
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

const activityData = [
    { date: 'Lun', users: 12, entities: 8 },
    { date: 'Mar', users: 19, entities: 15 },
    { date: 'Mer', users: 15, entities: 12 },
    { date: 'Jeu', users: 22, entities: 18 },
    { date: 'Ven', users: 28, entities: 24 },
    { date: 'Sam', users: 8, entities: 5 },
    { date: 'Dim', users: 5, entities: 3 },
];

export default function AdminDashboard() {
    const { users } = useAdminAuth();
    const { entities } = useEntityStore();

    const stats = {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.isActive).length,
        totalEntities: entities.length,
        validatedEntities: entities.filter(e => e.currentState === 'validated').length,
        rejectedEntities: entities.filter(e => e.currentState === 'rejected').length,
        pendingEntities: entities.filter(e => e.currentState === 'submitted').length,
    };

    const entityStateData = [
        { name: 'Brouillon', value: entities.filter(e => e.currentState === 'draft').length },
        { name: 'Soumis', value: entities.filter(e => e.currentState === 'submitted').length },
        { name: 'Validé', value: entities.filter(e => e.currentState === 'validated').length },
        { name: 'Rejeté', value: entities.filter(e => e.currentState === 'rejected').length },
        { name: 'Archivé', value: entities.filter(e => e.currentState === 'archived').length },
    ];

    const recentActivity = [
        { id: 1, type: 'user', message: 'Nouvel utilisateur inscrit: Claire Dupont', time: 'Il y a 2h' },
        { id: 2, type: 'entity', message: 'Document #1005 validé par Admin', time: 'Il y a 3h' },
        { id: 3, type: 'alert', message: 'Tentative de connexion échouée', time: 'Il y a 5h' },
        { id: 4, type: 'entity', message: 'Nouveau contrat créé: Partenariat 2024', time: 'Il y a 6h' },
    ];

    return (
        <div className="p-6 lg:p-8 space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-white">Tableau de bord</h1>
                <p className="text-slate-400">
                    Vue d'ensemble de votre plateforme Entity Flow Tracker
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400">Utilisateurs</p>
                                <p className="text-3xl font-bold text-white mt-1">{stats.totalUsers}</p>
                                <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" />
                                    {stats.activeUsers} actifs
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                                <Users className="h-6 w-6 text-indigo-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400">Entités totales</p>
                                <p className="text-3xl font-bold text-white mt-1">{stats.totalEntities}</p>
                                <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                                    <FileText className="h-3 w-3" />
                                    Documents, contrats...
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                                <FileText className="h-6 w-6 text-purple-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400">Validées</p>
                                <p className="text-3xl font-bold text-white mt-1">{stats.validatedEntities}</p>
                                <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    {Math.round((stats.validatedEntities / stats.totalEntities) * 100) || 0}% du total
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                                <CheckCircle className="h-6 w-6 text-green-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400">En attente</p>
                                <p className="text-3xl font-bold text-white mt-1">{stats.pendingEntities}</p>
                                <p className="text-xs text-amber-400 mt-2 flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    À traiter
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                                <Clock className="h-6 w-6 text-amber-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Activity className="h-5 w-5 text-indigo-400" />
                            Activité hebdomadaire
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={activityData}>
                                    <defs>
                                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorEntities" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                                    <YAxis stroke="#94a3b8" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1e293b',
                                            border: '1px solid #334155',
                                            borderRadius: '8px',
                                        }}
                                        labelStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="users" name="Utilisateurs" stroke="#6366f1" fillOpacity={1} fill="url(#colorUsers)" />
                                    <Area type="monotone" dataKey="entities" name="Entités" stroke="#22c55e" fillOpacity={1} fill="url(#colorEntities)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <FileText className="h-5 w-5 text-purple-400" />
                            Répartition par état
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={entityStateData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                    >
                                        {entityStateData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1e293b',
                                            border: '1px solid #334155',
                                            borderRadius: '8px',
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-400" />
                        Activité récente
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
                                <div className={`w-2 h-2 rounded-full ${activity.type === 'user' ? 'bg-indigo-400' :
                                        activity.type === 'entity' ? 'bg-green-400' :
                                            'bg-amber-400'
                                    }`} />
                                <p className="flex-1 text-sm text-slate-300">{activity.message}</p>
                                <span className="text-xs text-slate-500">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
