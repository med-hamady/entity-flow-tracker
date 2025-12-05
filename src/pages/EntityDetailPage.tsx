import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { EntityTimeline } from '@/components/entity/EntityTimeline';
import { VersionHistory } from '@/components/entity/VersionHistory';
import { StateBadge } from '@/components/entity/StateBadge';
import { mockEntities } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, User, FileText, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function EntityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const entity = mockEntities.find(e => e.id === id);

  if (!entity) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Entité non trouvée</p>
            <Link to="/entities">
              <Button variant="outline" className="mt-4">
                Retour aux entités
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8 space-y-6">
        <Link to="/entities">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour aux entités
          </Button>
        </Link>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground">{entity.name}</h1>
              <StateBadge state={entity.currentState} size="lg" />
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <FileText className="h-4 w-4" />
                {entity.type}
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                Créé le {format(entity.createdAt, 'PPP', { locale: fr })}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                Mis à jour le {format(entity.updatedAt, 'PPP', { locale: fr })}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="timeline" className="space-y-4">
              <TabsList>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="versions">Versions ({entity.versions.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="timeline">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Historique des transitions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EntityTimeline entity={entity} />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="versions">
                <VersionHistory versions={entity.versions} />
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Nombre de versions</span>
                  <span className="font-semibold">{entity.versions.length}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Transitions effectuées</span>
                  <span className="font-semibold">{entity.transitions.length}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">Dernier auteur</span>
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-semibold">
                      {entity.versions[entity.versions.length - 1]?.author || 'N/A'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in" style={{ animationDelay: '100ms' }}>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Actions possibles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {entity.currentState === 'draft' && (
                  <Button className="w-full" variant="default">
                    Soumettre pour validation
                  </Button>
                )}
                {entity.currentState === 'submitted' && (
                  <>
                    <Button className="w-full state-badge-validated">
                      Valider
                    </Button>
                    <Button className="w-full" variant="destructive">
                      Rejeter
                    </Button>
                  </>
                )}
                {entity.currentState === 'validated' && (
                  <Button className="w-full state-badge-archived">
                    Archiver
                  </Button>
                )}
                {entity.currentState === 'rejected' && (
                  <Button className="w-full" variant="outline">
                    Réviser et resoumettre
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
