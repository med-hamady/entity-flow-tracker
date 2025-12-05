import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, List, BarChart3, LogIn, UserPlus, Github, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/entities', label: 'Entités', icon: List },
  { path: '/statistics', label: 'Statistiques', icon: BarChart3 },
];

export function Navbar() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">LC</span>
            </div>
            <span className="text-lg font-semibold text-foreground">LifeCycle</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/med-hamady/entity-flow-tracker"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:block"
          >
            <Button variant="ghost" size="sm" className="gap-2">
              <Github className="h-4 w-4" />
              <span className="hidden lg:inline">GitHub</span>
            </Button>
          </a>
          <a
            href="https://www.nuitdelinfo.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:block"
          >
            <Button variant="ghost" size="sm" className="gap-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50">
              <Sparkles className="h-4 w-4" />
              <span className="hidden lg:inline">Nuit de l'Info</span>
            </Button>
          </a>
          <Link to="/login">
            <Button variant="ghost" size="sm" className="gap-2">
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Connexion</span>
            </Button>
          </Link>
          <Link to="/register">
            <Button size="sm" className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">S'inscrire</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
