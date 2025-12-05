import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEntityStore } from '@/hooks/useEntityStore';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import {
    BarChart3,
    Download,
    TrendingUp,
    TrendingDown,
    Users,
    FileText,
    CheckCircle,
    Clock,
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';
import { useToast } from '@/hooks/use-toast';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

const monthlyData = [
    { month: 'Jan', entities: 45, users: 12 },
    { month: 'Fév', entities: 52, users: 18 },
    { month: 'Mar', entities: 48, users: 15 },
    { month: 'Avr', entities: 61, users: 22 },
    { month: 'Mai', entities: 55, users: 20 },
    { month: 'Juin', entities: 67, users: 28 },
    { month: 'Juil', entities: 43, users: 16 },
    { month: 'Août', entities: 38, users: 10 },
    { month: 'Sep', entities: 72, users: 32 },
    { month: 'Oct', entities: 78, users: 35 },
    { month: 'Nov', entities: 65, users: 25 },
    { month: 'Déc', entities: 58, users: 20 },
];

export default function ReportsPage() {
    const { entities } = useEntityStore();
    const { users } = useAdminAuth();
    const { toast } = useToast();

    const stateData = [
        { name: 'Brouillon', value: entities.filter(e => e.currentState === 'draft').length },
        { name: 'Soumis', value: entities.filter(e => e.currentState === 'submitted').length },
        { name: 'Validé', value: entities.filter(e => e.currentState === 'validated').length },
        { name: 'Rejeté', value: entities.filter(e => e.currentState === 'rejected').length },
        { name: 'Archivé', value: entities.filter(e => e.currentState === 'archived').length },
    ];

    const typeData = entities.reduce((acc, entity) => {
        const existing = acc.find(a => a.name === entity.type);
        if (existing) existing.value++;
        else acc.push({ name: entity.type, value: 1 });
        return acc;
    }, [] as { name: string; value: number }[]);

    const kpis = [
        {
            label: 'Taux de validation',
            value: `${Math.round((entities.filter(e => e.currentState === 'validated').length / entities.length) * 100) || 0}%`,
            trend: 'up',
            change: '+5.2%',
            icon: CheckCircle,
            color: 'text-green-400',
        },
        {
            label: 'Temps moyen de traitement',
            value: '2.3 jours',
            trend: 'down',
            change: '-12%',
            icon: Clock,
            color: 'text-amber-400',
        },
        {
            label: 'Utilisateurs actifs',
            value: users.filter(u => u.isActive).length,
            trend: 'up',
            change: '+18%',
            icon: Users,
            color: 'text-indigo-400',
        },
        {
            label: 'Entités ce mois',
            value: entities.length,
            trend: 'up',
            change: '+8%',
            icon: FileText,
            color: 'text-purple-400',
        },
    ];

    const handleExport = (type: 'pdf' | 'excel') => {
        toast({
            title: 'Export en cours',
            description: `Le rapport ${type.toUpperCase()} sera téléchargé sous peu.`,
        });
    };

    return (
        <div className="p-6 lg:p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <BarChart3 className="h-8 w-8 text-amber-400" />
                        Rapports et analyses
                    </h1>
                    <p className="text-slate-400">
                        Statistiques détaillées et indicateurs de performance
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button
                        onClick={() => handleExport('excel')}
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700 gap-2"
                    >
                        <Download className="h-4 w-4" />
                        Export Excel
                    </Button>
                    <Button
                        onClick={() => handleExport('pdf')}
                        className="bg-amber-600 hover:bg-amber-700 gap-2"
                    >
                        <Download className="h-4 w-4" />
                        Export PDF
                    </Button>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi, index) => (
                    <Card key={index} className="bg-slate-800/50 border-slate-700">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-400">{kpi.label}</p>
                                    <p className={`text-3xl font-bold mt-1 ${kpi.color}`}>{kpi.value}</p>
                                    <p className={`text-xs mt-2 flex items-center gap-1 ${kpi.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                                        {kpi.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                        {kpi.change} ce mois
                                    </p>
                                </div>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.color} bg-current/10`}>
                                    <kpi.icon className="h-6 w-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white">Évolution annuelle</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                                    <YAxis stroke="#94a3b8" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1e293b',
                                            border: '1px solid #334155',
                                            borderRadius: '8px',
                                        }}
                                    />
                                    <Legend />
                                    <Line type="monotone" dataKey="entities" name="Entités" stroke="#6366f1" strokeWidth={2} />
                                    <Line type="monotone" dataKey="users" name="Utilisateurs" stroke="#22c55e" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white">Par type d'entité</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={typeData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                                    <YAxis stroke="#94a3b8" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1e293b',
                                            border: '1px solid #334155',
                                            borderRadius: '8px',
                                        }}
                                    />
                                    <Bar dataKey="value" name="Nombre" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Pie Chart */}
            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-white">Répartition par état</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stateData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                >
                                    {stateData.map((_, index) => (
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
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
