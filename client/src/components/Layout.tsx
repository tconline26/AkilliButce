import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Bell, Moon, Sun, Wallet, Plus, Menu, Home, List, PieChart, Target, User as UserIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
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
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved ? saved === 'true' : true;
  });
  const [sidebarHovering, setSidebarHovering] = useState(false);

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

  const toggleSidebar = () => {
    setSidebarOpen((v) => {
      const nv = !v;
      localStorage.setItem('sidebarOpen', nv ? 'true' : 'false');
      return nv;
    });
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

  const navigationItems: Array<{ path: string; label: string; Icon: LucideIcon }> = [
    { path: '/', label: 'Ana Sayfa', Icon: Home },
    { path: '/transactions', label: 'İşlemler', Icon: List },
    { path: '/budgets', label: 'Bütçe', Icon: PieChart },
    { path: '/goals', label: 'Hedefler', Icon: Target },
    { path: '/profile', label: 'Profil', Icon: UserIcon },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside
          className={`hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 z-[70] border-r border-border bg-background/95 backdrop-blur-sm shadow-sm transition-[width] duration-300 ease-in-out ${sidebarOpen ? 'md:w-64' : (sidebarHovering ? 'md:w-64' : 'md:w-16')}`}
          aria-label="Primary"
          aria-expanded={sidebarOpen}
          onMouseEnter={() => setSidebarHovering(true)}
          onMouseLeave={() => setSidebarHovering(false)}
        >
          <div className="px-3 py-2 flex items-center justify-between h-14 border-b border-border">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <Wallet className="text-primary-foreground" size={16} />
              </div>
              {sidebarOpen && <span className="font-semibold tracking-wide">Akıllı Bütçe</span>}
            </div>
            <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Menüyü Aç/Kapat">
              <Menu size={18} />
            </Button>
          </div>
          <nav className="p-2 space-y-1 overflow-y-auto">
            {navigationItems.map(({ path, label, Icon }) => {
              const isActive = location === path;
              const collapsed = !sidebarOpen && !sidebarHovering;
              return (
                <div key={path} className="relative group">
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={`w-full justify-start relative rounded-md px-2 ${isActive ? 'font-medium' : ''}`}
                    onClick={() => navigate(path)}
                    data-testid={`sidebar-${label.toLowerCase().replace(' ', '-')}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-primary rounded-r"></span>
                    )}
                    <Icon size={18} className={`text-muted-foreground group-hover:text-foreground transition-colors ${collapsed ? '' : 'mr-3'}`} />
                    {!collapsed && <span className="truncate">{label}</span>}
                  </Button>
                  {collapsed && (
                    <span
                      role="tooltip"
                      className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 hidden whitespace-nowrap rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground shadow-lg border border-border group-hover:block"
                    >
                      {label}
                    </span>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>
      )}

      {/* Hover overlay: blocks interactions while sidebar is visually expanded */}
      {!isMobile && !sidebarOpen && sidebarHovering && (
        <div
          className="fixed inset-0 z-[60] bg-transparent"
          aria-hidden="true"
          onMouseDown={() => setSidebarHovering(false)}
          onMouseEnter={() => setSidebarHovering(false)}
        />
      )}

      {/* Right side content */}
      <div
        className={`flex-1 flex flex-col w-0 ${(!isMobile && !sidebarOpen && sidebarHovering) ? 'pointer-events-none' : ''}`}
        onMouseDown={() => setSidebarHovering(false)}
        onFocusCapture={() => setSidebarHovering(false)}
      >
        {/* Header */}
        <header className={`sticky top-0 z-[50] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border ${!isMobile ? (sidebarOpen ? 'md:ml-60' : 'md:ml-16') : ''}`}>
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {isMobile && (
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Wallet className="text-primary-foreground text-sm" size={16} />
                  </div>
                )}
                <h1 className={`text-lg font-semibold transition-opacity ${(!sidebarOpen && sidebarHovering) ? 'opacity-0' : 'opacity-100'}`}>Akıllı Bütçe</h1>
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
        <main
          className={`flex-1 container mx-auto px-4 py-6 ${isMobile ? 'pb-24' : 'pb-6'} transition-[margin] duration-200 ease-in-out ${!isMobile ? (sidebarOpen ? 'md:ml-60' : 'md:ml-16') : ''}`}
          onMouseDown={() => setSidebarHovering(false)}
        >
          {children}
        </main>

        {/* Mobile Navigation */}
        {isMobile && (
          <nav className="navigation-bar fixed bottom-0 left-0 right-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border">
            <div className="flex items-center justify-around py-3 px-4 safe-area-bottom">
              {navigationItems.map(({ path, label, Icon }) => {
                const isActive = location === path;
                return (
                  <Button
                    key={path}
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(path)}
                    className={`flex flex-col items-center space-y-1 p-2 ${
                      isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                    }`}
                    data-testid={`nav-${label.toLowerCase().replace(' ', '-')}`}
                  >
                    <Icon size={18} />
                    <span className="text-xs">{label}</span>
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
    </div>
  );
}
