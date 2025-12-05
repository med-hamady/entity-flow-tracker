import { EntityVersion } from '@/types/entity';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { User, Calendar, FileText } from 'lucide-react';

interface VersionHistoryProps {
  versions: EntityVersion[];
}

export function VersionHistory({ versions }: VersionHistoryProps) {
  const sortedVersions = [...versions].sort((a, b) => b.version - a.version);

  return (
    <div className="space-y-3">
      {sortedVersions.map((version, index) => (
        <Card 
          key={version.id} 
          className="animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                  v{version.version}
                </span>
                {index === 0 && (
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-state-validated-bg text-state-validated">
                    Actuelle
                  </span>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  {version.author}
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {format(new Date(version.createdAt), 'PPp', { locale: fr })}
                </div>
              </div>
              
              <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span className="text-foreground">{version.content}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
