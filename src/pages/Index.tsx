import { Navbar } from '@/components/layout/Navbar';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { StateDistributionChart } from '@/components/dashboard/StateDistributionChart';
import { MonthlyTrendsChart } from '@/components/dashboard/MonthlyTrendsChart';
import { RecentEntities } from '@/components/dashboard/RecentEntities';
import { mockStats, mockEntities } from '@/data/mockData';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      <main className="container px-4 md:px-6 lg:px-8 py-6 md:py-10 space-y-6 md:space-y-10">
        <div className="space-y-2 md:space-y-3 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
            Vue d'ensemble du cycle de vie de vos entités
          </p>
        </div>

        <StatsOverview stats={mockStats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
          <StateDistributionChart stats={mockStats} />
          <MonthlyTrendsChart />
        </div>

        <RecentEntities entities={mockEntities} />
      </main>
    </div>
  );
};

export default Index;
