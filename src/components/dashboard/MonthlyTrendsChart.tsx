import { monthlyStats } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function MonthlyTrendsChart() {
  return (
    <Card className="animate-fade-in" style={{ animationDelay: '100ms' }}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Tendances mensuelles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyStats}>
              <defs>
                <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(231, 48%, 48%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(231, 48%, 48%)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorValidated" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorRejected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="created"
                name="Créées"
                stroke="hsl(231, 48%, 48%)"
                fillOpacity={1}
                fill="url(#colorCreated)"
              />
              <Area
                type="monotone"
                dataKey="validated"
                name="Validées"
                stroke="hsl(142, 71%, 45%)"
                fillOpacity={1}
                fill="url(#colorValidated)"
              />
              <Area
                type="monotone"
                dataKey="rejected"
                name="Rejetées"
                stroke="hsl(0, 84%, 60%)"
                fillOpacity={1}
                fill="url(#colorRejected)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
