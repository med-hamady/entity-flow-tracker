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
  // Clean entity name by removing # if present
  const cleanName = entity.name.replace(/#/g, '');

  return (
    <Link to={`/entities/${entity.id}`}>
      <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-primary/50 animate-fade-in border-2">
        <CardHeader className="pb-3 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0 space-y-2">
              <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors truncate">
                {cleanName}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4 flex-shrink-0" />
                <span className="font-medium">{entity.type}</span>
              </div>
            </div>
            <StateBadge state={entity.currentState} size="sm" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{formatDistanceToNow(entity.updatedAt, { addSuffix: true, locale: fr })}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4 flex-shrink-0" />
              <span className="truncate font-medium">{entity.versions[entity.versions.length - 1]?.author || 'N/A'}</span>
            </div>
          </div>

          {lastTransition && (
            <div className="flex items-center gap-2 pt-3 border-t border-border">
              <StateBadge state={lastTransition.fromState} size="sm" />
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <StateBadge state={lastTransition.toState} size="sm" />
            </div>
          )}

          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground pt-2 border-t">
            <span className="flex items-center gap-1">
              <span className="text-primary">{entity.versions.length}</span> version(s)
            </span>
            <span className="flex items-center gap-1">
              <span className="text-primary">{entity.transitions.length}</span> transition(s)
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
