import { Entity } from '@/types/entity';
import { StateCard } from '@/components/entity/StateCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface RecentEntitiesProps {
  entities: Entity[];
}

export function RecentEntities({ entities }: RecentEntitiesProps) {
  const recentEntities = [...entities]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  return (
    <Card className="animate-fade-in" style={{ animationDelay: '200ms' }}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Entités récentes</CardTitle>
        <Link 
          to="/entities" 
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          Voir tout
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentEntities.map((entity) => (
            <StateCard key={entity.id} entity={entity} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
