import { EntityStats } from '@/types/entity';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, CheckCircle2, Clock, TrendingUp } from 'lucide-react';

interface StatsOverviewProps {
  stats: EntityStats;
}

const statCards = [
  {
    key: 'total',
    label: 'Total des entités',
    icon: FileText,
    getValue: (stats: EntityStats) => stats.totalEntities,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    key: 'validated',
    label: 'Entités validées',
    icon: CheckCircle2,
    getValue: (stats: EntityStats) => stats.byState.validated,
    color: 'text-state-validated',
    bgColor: 'bg-state-validated-bg',
  },
  {
    key: 'avgTime',
    label: 'Temps moyen (jours)',
    icon: Clock,
    getValue: (stats: EntityStats) => stats.averageTimeInState.draft.toFixed(1),
    color: 'text-state-submitted',
    bgColor: 'bg-state-submitted-bg',
  },
  {
    key: 'success',
    label: 'Taux de succès',
    icon: TrendingUp,
    getValue: (stats: EntityStats) => `${stats.successRate}%`,
    color: 'text-state-validated',
    bgColor: 'bg-state-validated-bg',
  },
];

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card 
            key={card.key} 
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                  <p className="text-3xl font-bold text-foreground">
                    {card.getValue(stats)}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${card.bgColor}`}>
                  <Icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
