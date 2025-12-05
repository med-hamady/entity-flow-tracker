import { useState, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { StateCard } from '@/components/entity/StateCard';
import { mockEntities, stateLabels } from '@/data/mockData';
import { EntityState } from '@/types/entity';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

const allStates: (EntityState | 'all')[] = ['all', 'draft', 'submitted', 'validated', 'rejected', 'archived'];

export default function EntitiesPage() {
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState<EntityState | 'all'>('all');

  const filteredEntities = useMemo(() => {
    return mockEntities.filter(entity => {
      const matchesSearch = entity.name.toLowerCase().includes(search.toLowerCase()) ||
                           entity.type.toLowerCase().includes(search.toLowerCase());
      const matchesState = stateFilter === 'all' || entity.currentState === stateFilter;
      return matchesSearch && matchesState;
    });
  }, [search, stateFilter]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Entités</h1>
          <p className="text-muted-foreground">
            Explorez et gérez toutes vos entités
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une entité..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            {allStates.map((state) => (
              <Button
                key={state}
                variant={stateFilter === state ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStateFilter(state)}
                className={cn(
                  'whitespace-nowrap',
                  stateFilter === state && 'shadow-md'
                )}
              >
                {state === 'all' ? 'Tous' : stateLabels[state]}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredEntities.map((entity) => (
            <StateCard key={entity.id} entity={entity} />
          ))}
        </div>

        {filteredEntities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucune entité trouvée</p>
          </div>
        )}
      </main>
    </div>
  );
}
