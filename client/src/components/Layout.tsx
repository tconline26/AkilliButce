import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Bell, Moon, Sun, User, Wallet, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import TransactionModal from '@/components/Modals/TransactionModal';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const navigationItems = [
    { path: '/', icon: 'fas fa-home', label: 'Ana Sayfa' },
    { path: '/transactions', icon: 'fas fa-list', label: 'İşlemler' },
    { path: '/budgets', icon: 'fas fa-chart-pie', label: 'Bütçe' },
    { path: '/goals', icon: 'fas fa-bullseye', label: 'Hedefler' },
    { path: '/profile', icon: 'fas fa-user', label: 'Profil' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Wallet className="text-primary-foreground text-sm" size={16} />
              </div>
              <h1 className="text-lg font-semibold">Akıllı Bütçe</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                data-testid="button-theme-toggle"
              >
                {theme === 'light' ? (
                  <Moon className="text-muted-foreground" size={16} />
                ) : (
                  <Sun className="text-muted-foreground" size={16} />
                )}
              </Button>
              
              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                className="relative"
                data-testid="button-notifications"
              >
                <Bell className="text-muted-foreground" size={16} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full"></span>
              </Button>
              
              {/* Profile */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/profile')}
                data-testid="button-profile"
              >
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-primary-foreground">
                    {getUserInitials()}
                  </span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 pb-20 md:pb-6">
        {children}
      </main>

      {/* Mobile Navigation */}
      {isMobile && (
        <nav className="navigation-bar fixed bottom-0 left-0 right-0 z-30">
          <div className="flex items-center justify-around py-2">
            {navigationItems.map((item) => {
              const isActive = location === item.path;
              return (
                <Button
                  key={item.path}
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center space-y-1 p-2 ${
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
                >
                  <i className={`${item.icon} text-lg`}></i>
                  <span className="text-xs">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </nav>
      )}

      {/* Floating Action Button */}
      <Button
        className="floating-action w-14 h-14 rounded-full text-white flex items-center justify-center hover:scale-105 transition-transform"
        onClick={() => setShowTransactionModal(true)}
        data-testid="button-quick-add"
      >
        <Plus className="text-xl" size={24} />
      </Button>

      {/* Transaction Modal */}
      <TransactionModal
        open={showTransactionModal}
        onOpenChange={setShowTransactionModal}
      />
    </div>
  );
}
