import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  User, 
  Mail, 
  Calendar, 
  Bell, 
  Shield, 
  Download, 
  Trash2, 
  Settings,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [notifications, setNotifications] = useState({
    budgetAlerts: true,
    weeklyReports: true,
    goalReminders: true,
    aiInsights: true,
  });

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    toast({
      title: "Tema Değiştirildi",
      description: `${newTheme === 'dark' ? 'Karanlık' : 'Aydınlık'} tema aktif edildi.`,
    });
  };

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  const handleNotificationChange = (key: keyof typeof notifications, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Bildirim Ayarı Güncellendi",
      description: `${value ? 'Etkinleştirildi' : 'Devre dışı bırakıldı'}.`,
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

  const formatJoinDate = (date: Date) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="space-y-6" data-testid="profile-page">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Profil</h1>
          <p className="text-muted-foreground">Hesap bilgilerinizi ve ayarlarınızı yönetin</p>
        </div>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User size={20} />
            Profil Bilgileri
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user.profileImageUrl || undefined} />
              <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl font-semibold" data-testid="text-user-name">
                {user.firstName && user.lastName 
                  ? `${user.firstName} ${user.lastName}` 
                  : user.email
                }
              </h2>
              <p className="text-muted-foreground" data-testid="text-user-email">{user.email}</p>
              <Badge variant="secondary" className="mt-2">
                Aktif Kullanıcı
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium">E-posta</span>
              </div>
              <p className="text-sm text-muted-foreground ml-6">{user.email}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium">Katılım Tarihi</span>
              </div>
              <p className="text-sm text-muted-foreground ml-6">
                {formatJoinDate(user.createdAt)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings size={20} />
            Uygulama Ayarları
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Setting */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
              <div>
                <Label htmlFor="theme-toggle" className="text-sm font-medium">
                  Karanlık Tema
                </Label>
                <p className="text-sm text-muted-foreground">
                  Arayüz temasını değiştirin
                </p>
              </div>
            </div>
            <Switch
              id="theme-toggle"
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
              data-testid="switch-theme"
            />
          </div>

          <Separator />

          {/* Notification Settings */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Bell size={20} />
              <h3 className="text-sm font-medium">Bildirim Ayarları</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="budget-alerts" className="text-sm">Bütçe Uyarıları</Label>
                  <p className="text-xs text-muted-foreground">Bütçe limitlerinde uyarı alın</p>
                </div>
                <Switch
                  id="budget-alerts"
                  checked={notifications.budgetAlerts}
                  onCheckedChange={(checked) => handleNotificationChange('budgetAlerts', checked)}
                  data-testid="switch-budget-alerts"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weekly-reports" className="text-sm">Haftalık Raporlar</Label>
                  <p className="text-xs text-muted-foreground">Haftalık finansal özet raporları</p>
                </div>
                <Switch
                  id="weekly-reports"
                  checked={notifications.weeklyReports}
                  onCheckedChange={(checked) => handleNotificationChange('weeklyReports', checked)}
                  data-testid="switch-weekly-reports"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="goal-reminders" className="text-sm">Hedef Hatırlatıcıları</Label>
                  <p className="text-xs text-muted-foreground">Finansal hedef ilerlemeleri</p>
                </div>
                <Switch
                  id="goal-reminders"
                  checked={notifications.goalReminders}
                  onCheckedChange={(checked) => handleNotificationChange('goalReminders', checked)}
                  data-testid="switch-goal-reminders"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="ai-insights" className="text-sm">AI Önerileri</Label>
                  <p className="text-xs text-muted-foreground">Yapay zeka destekli finansal öneriler</p>
                </div>
                <Switch
                  id="ai-insights"
                  checked={notifications.aiInsights}
                  onCheckedChange={(checked) => handleNotificationChange('aiInsights', checked)}
                  data-testid="switch-ai-insights"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield size={20} />
            Veri Yönetimi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Button variant="outline" className="flex items-center gap-2" data-testid="button-export-data">
              <Download size={16} />
              Verilerimi İndir
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2" data-testid="button-clear-data">
              <Trash2 size={16} />
              Verileri Temizle
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <p>
              • Verilerinizi CSV veya JSON formatında indirebilirsiniz
            </p>
            <p>
              • Veri temizleme işlemi geri alınamaz
            </p>
            <p>
              • Tüm verileriniz güvenli şekilde şifrelenerek saklanır
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Hesap İşlemleri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            variant="outline"
            onClick={handleLogout}
            className="w-full md:w-auto flex items-center gap-2"
            data-testid="button-logout"
          >
            <LogOut size={16} />
            Çıkış Yap
          </Button>
          
          <div className="text-xs text-muted-foreground">
            <p>Çıkış yaptığınızda tekrar giriş yapmanız gerekecektir.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
