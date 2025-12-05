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
      <main className="container px-4 md:px-6 lg:px-8 py-6 md:py-10 space-y-6 md:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div className="space-y-2 md:space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Entités
            </h1>
            <p className="text-base md:text-lg text-muted-foreground">
              Explorez et gérez toutes vos entités
            </p>
          </div>
          <CreateEntityDialog onCreateEntity={addEntity} />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 md:h-5 w-4 md:w-5 text-muted-foreground" />
            <Input
              placeholder="Rechercher une entité..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 md:pl-11 h-10 md:h-12 text-sm md:text-base border-2 focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            <Filter className="h-4 md:h-5 w-4 md:w-5 text-muted-foreground flex-shrink-0" />
            {allStates.map((state) => (
              <Button
                key={state}
                variant={stateFilter === state ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStateFilter(state)}
                className={cn(
                  'whitespace-nowrap font-semibold border-2 transition-all text-xs md:text-sm h-10 md:h-11',
                  stateFilter === state && 'shadow-lg scale-105'
                )}
              >
                {state === 'all' ? 'Tous' : stateLabels[state]}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredEntities.map((entity, index) => (
            <div key={entity.id} className="animate-fade-in" style={{ animationDelay: `${Math.min(index * 50, 500)}ms` }}>
              <StateCard entity={entity} />
            </div>
          ))}
        </div>

        {filteredEntities.length === 0 && (
          <div className="text-center py-12 md:py-16 animate-fade-in">
            <p className="text-lg md:text-xl text-muted-foreground font-medium">Aucune entité trouvée</p>
          </div>
        )}
      </main>
    </div>
  );
}
