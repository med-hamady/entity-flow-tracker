import { useState, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { StateCard } from '@/components/entity/StateCard';
import { CreateEntityDialog } from '@/components/entity/CreateEntityDialog';
import { stateLabels } from '@/data/mockData';
import { useEntityStore } from '@/hooks/useEntityStore';
import { EntityState } from '@/types/entity';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

const allStates: (EntityState | 'all')[] = ['all', 'draft', 'submitted', 'validated', 'rejected', 'archived'];

export default function EntitiesPage() {
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState<EntityState | 'all'>('all');
  const { entities, addEntity } = useEntityStore();

  const filteredEntities = useMemo(() => {
    return entities.filter(entity => {
      const matchesSearch = entity.name.toLowerCase().includes(search.toLowerCase()) ||
        entity.type.toLowerCase().includes(search.toLowerCase());
      const matchesState = stateFilter === 'all' || entity.currentState === stateFilter;
      return matchesSearch && matchesState;
    });
  }, [entities, search, stateFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      <main className="container py-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Entités
            </h1>
            <p className="text-lg text-muted-foreground">
              Explorez et gérez toutes vos entités
            </p>
          </div>
          <CreateEntityDialog onCreateEntity={addEntity} />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Rechercher une entité..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-12 text-base border-2 focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            <Filter className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            {allStates.map((state) => (
              <Button
                key={state}
                variant={stateFilter === state ? 'default' : 'outline'}
                size="lg"
                onClick={() => setStateFilter(state)}
                className={cn(
                  'whitespace-nowrap font-semibold border-2 transition-all',
                  stateFilter === state && 'shadow-lg scale-105'
                )}
              >
                {state === 'all' ? 'Tous' : stateLabels[state]}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEntities.map((entity, index) => (
            <div key={entity.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
              <StateCard entity={entity} />
            </div>
          ))}
        </div>

        {filteredEntities.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <p className="text-xl text-muted-foreground font-medium">Aucune entité trouvée</p>
          </div>
        )}
      </main>
    </div>
  );
}
