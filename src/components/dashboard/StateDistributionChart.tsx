import { EntityStats, EntityState } from '@/types/entity';
import { stateLabels } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface StateDistributionChartProps {
  stats: EntityStats;
}

const stateColors: Record<EntityState, string> = {
  draft: 'hsl(220, 9%, 46%)',
  submitted: 'hsl(38, 92%, 50%)',
  validated: 'hsl(142, 71%, 45%)',
  rejected: 'hsl(0, 84%, 60%)',
  archived: 'hsl(262, 52%, 47%)',
};

export function StateDistributionChart({ stats }: StateDistributionChartProps) {
  const data = Object.entries(stats.byState).map(([state, count]) => ({
    name: stateLabels[state as EntityState],
    value: count,
    color: stateColors[state as EntityState],
  }));

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Distribution par état</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span className="text-sm text-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
