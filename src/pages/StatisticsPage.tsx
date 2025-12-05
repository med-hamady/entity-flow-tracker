import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { monthlyStats, timeInStateData, mockStats, mockEntities } from '@/data/mockData';
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
} from 'recharts';

const COLORS = ['hsl(231, 48%, 48%)', 'hsl(142, 71%, 45%)', 'hsl(38, 92%, 50%)', 'hsl(0, 84%, 60%)', 'hsl(262, 52%, 47%)'];

const authorStats = mockEntities.reduce((acc, entity) => {
  entity.transitions.forEach(t => {
    acc[t.author] = (acc[t.author] || 0) + 1;
  });
  return acc;
}, {} as Record<string, number>);

const authorData = Object.entries(authorStats)
  .map(([name, count]) => ({ name, actions: count }))
  .sort((a, b) => b.actions - a.actions);

const typeStats = mockEntities.reduce((acc, entity) => {
  acc[entity.type] = (acc[entity.type] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

const typeData = Object.entries(typeStats).map(([name, value]) => ({ name, value }));

export default function StatisticsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Statistiques avancées</h1>
          <p className="text-muted-foreground">
            Analysez en profondeur le cycle de vie de vos entités
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Évolution mensuelle</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Line type="monotone" dataKey="created" name="Créées" stroke="hsl(231, 48%, 48%)" strokeWidth={2} dot={{ fill: 'hsl(231, 48%, 48%)' }} />
                    <Line type="monotone" dataKey="validated" name="Validées" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={{ fill: 'hsl(142, 71%, 45%)' }} />
                    <Line type="monotone" dataKey="rejected" name="Rejetées" stroke="hsl(0, 84%, 60%)" strokeWidth={2} dot={{ fill: 'hsl(0, 84%, 60%)' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Temps moyen par état (jours)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeInStateData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis dataKey="state" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="avgDays" name="Jours moyens" fill="hsl(231, 48%, 48%)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Actions par acteur</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={authorData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="actions" name="Actions" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: '300ms' }}>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Répartition par type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {typeData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="animate-fade-in" style={{ animationDelay: '400ms' }}>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Résumé des performances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-3xl font-bold text-primary">{mockStats.successRate}%</p>
                <p className="text-sm text-muted-foreground mt-1">Taux de succès</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-3xl font-bold text-state-validated">{mockStats.byState.validated}</p>
                <p className="text-sm text-muted-foreground mt-1">Entités validées</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-3xl font-bold text-state-submitted">{mockStats.revisionRate.toFixed(1)}</p>
                <p className="text-sm text-muted-foreground mt-1">Révisions moyennes</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-3xl font-bold text-state-rejected">{mockStats.byState.rejected}</p>
                <p className="text-sm text-muted-foreground mt-1">Entités rejetées</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
