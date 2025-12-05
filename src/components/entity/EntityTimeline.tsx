import { Entity, EntityTransition } from '@/types/entity';
import { stateLabels } from '@/data/mockData';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { User, ArrowRight, MessageSquare } from 'lucide-react';

interface EntityTimelineProps {
  entity: Entity;
}

export function EntityTimeline({ entity }: EntityTimelineProps) {
  const allEvents = [
    { type: 'created', date: entity.createdAt, state: 'draft' as const },
    ...entity.transitions.map(t => ({ type: 'transition', date: t.timestamp, transition: t })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-1">
      {allEvents.map((event, index) => (
        <div
          key={index}
          className={cn(
            'relative flex gap-4 pb-8 animate-slide-in',
            index === allEvents.length - 1 && 'pb-0'
          )}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Timeline line */}
          {index !== allEvents.length - 1 && (
            <div className="absolute left-[11px] top-6 h-full w-0.5 bg-border" />
          )}
          
          {/* Timeline dot */}
          <div
            className={cn(
              'relative z-10 h-6 w-6 rounded-full flex items-center justify-center ring-4 ring-background',
              event.type === 'created' 
                ? 'timeline-dot-draft'
                : `timeline-dot-${(event as { transition: EntityTransition }).transition.toState}`
            )}
          >
            <div className="h-2 w-2 rounded-full bg-white/80" />
          </div>
          
          {/* Content */}
          <div className="flex-1 space-y-2 pt-0.5">
            {event.type === 'created' ? (
              <>
                <p className="font-medium text-foreground">
                  Entité créée
                </p>
                <p className="text-sm text-muted-foreground">
                  État initial: <span className="font-medium">{stateLabels.draft}</span>
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn(
                    'px-2 py-0.5 text-xs font-medium rounded-full',
                    `state-badge-${(event as { transition: EntityTransition }).transition.fromState}`
                  )}>
                    {stateLabels[(event as { transition: EntityTransition }).transition.fromState]}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <span className={cn(
                    'px-2 py-0.5 text-xs font-medium rounded-full',
                    `state-badge-${(event as { transition: EntityTransition }).transition.toState}`
                  )}>
                    {stateLabels[(event as { transition: EntityTransition }).transition.toState]}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    {(event as { transition: EntityTransition }).transition.author}
                  </div>
                </div>
                
                {(event as { transition: EntityTransition }).transition.reason && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 text-sm">
                    <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>{(event as { transition: EntityTransition }).transition.reason}</span>
                  </div>
                )}
              </>
            )}
            
            <p className="text-xs text-muted-foreground">
              {format(new Date(event.date), 'PPPp', { locale: fr })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
