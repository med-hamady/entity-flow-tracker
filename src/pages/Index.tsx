import { Navbar } from '@/components/layout/Navbar';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { StateDistributionChart } from '@/components/dashboard/StateDistributionChart';
import { MonthlyTrendsChart } from '@/components/dashboard/MonthlyTrendsChart';
import { RecentEntities } from '@/components/dashboard/RecentEntities';
import { mockStats, mockEntities } from '@/data/mockData';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Vue d'ensemble du cycle de vie de vos entités
          </p>
        </div>
        
        <StatsOverview stats={mockStats} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StateDistributionChart stats={mockStats} />
          <MonthlyTrendsChart />
        </div>
        
        <RecentEntities entities={mockEntities} />
      </main>
    </div>
  );
};

export default Index;
