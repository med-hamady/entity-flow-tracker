import { Entity } from '@/types/entity';
import { StateBadge } from './StateBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ArrowRight, Clock, User, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StateCardProps {
  entity: Entity;
}

export function StateCard({ entity }: StateCardProps) {
  const lastTransition = entity.transitions[entity.transitions.length - 1];
  
  return (
    <Link to={`/entities/${entity.id}`}>
      <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-primary/30 animate-fade-in">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
                {entity.name}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-3.5 w-3.5" />
                {entity.type}
              </div>
            </div>
            <StateBadge state={entity.currentState} size="sm" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {formatDistanceToNow(entity.updatedAt, { addSuffix: true, locale: fr })}
            </div>
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              {entity.versions[entity.versions.length - 1]?.author || 'N/A'}
            </div>
          </div>
          
          {lastTransition && (
            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <StateBadge state={lastTransition.fromState} size="sm" />
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
              <StateBadge state={lastTransition.toState} size="sm" />
            </div>
          )}
          
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
            <span>{entity.versions.length} version(s)</span>
            <span>{entity.transitions.length} transition(s)</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
