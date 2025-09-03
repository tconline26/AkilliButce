import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { isUnauthorizedError } from '@/lib/authUtils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Target, Calendar, TrendingUp, Edit, Trash2 } from 'lucide-react';
import { AIService } from '@/lib/aiService';
import { apiRequest } from '@/lib/queryClient';
import type { FinancialGoal } from '@shared/schema';

export default function Goals() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    targetDate: '',
    icon: 'fas fa-target',
    color: '#4CAF50'
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

  // Fetch financial goals
  const { data: goals = [], isLoading: goalsLoading } = useQuery({
    queryKey: ['/api/goals'],
    retry: false,
  });

  // Create/Update goal mutation
  const createOrUpdateGoalMutation = useMutation({
    mutationFn: async (goalData: any) => {
      if (editingGoal?.id) {
        return apiRequest('PUT', `/api/goals/${editingGoal.id}`, goalData);
      }
      return apiRequest('POST', '/api/goals', goalData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/goals'] });
      setShowGoalModal(false);
      resetForm();
      toast({
        title: "Başarılı",
        description: editingGoal?.id ? "Finansal hedef güncellendi." : "Yeni finansal hedef oluşturuldu.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Hata",
        description: editingGoal?.id ? "Hedef güncellenirken bir hata oluştu." : "Hedef oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  // Delete goal mutation
  const deleteGoalMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/goals/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/goals'] });
      toast({
        title: "Silindi",
        description: "Finansal hedef silindi.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Hata",
        description: "Hedef silinirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      targetAmount: '',
      targetDate: '',
      icon: 'fas fa-target',
      color: '#4CAF50'
    });
    setEditingGoal(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.targetAmount || !formData.targetDate) {
      toast({
        title: "Hata",
        description: "Lütfen tüm zorunlu alanları doldurun.",
        variant: "destructive",
      });
      return;
    }

    const goalData = {
      title: formData.title,
      description: formData.description,
      targetAmount: formData.targetAmount,
      targetDate: formData.targetDate,
      icon: formData.icon,
      color: formData.color,
      currentAmount: editingGoal?.currentAmount || '0'
    };

    createOrUpdateGoalMutation.mutate(goalData);
  };

  const handleEditGoal = (goal: FinancialGoal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description || '',
      targetAmount: goal.targetAmount,
      targetDate: new Date(goal.targetDate).toISOString().split('T')[0],
      icon: goal.icon,
      color: goal.color
    });
    setShowGoalModal(true);
  };

  const handleDeleteGoal = (id: string) => {
    if (window.confirm('Bu hedefi silmek istediğinizden emin misiniz?')) {
      deleteGoalMutation.mutate(id);
    }
  };

  const calculateProgress = (current: string, target: string) => {
    const currentAmount = parseFloat(current);
    const targetAmount = parseFloat(target);
    return targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0;
  };

  const getDaysRemaining = (targetDate: Date) => {
    const now = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Süresi geçti';
    if (diffDays === 0) return 'Bugün';
    if (diffDays === 1) return '1 gün kaldı';
    if (diffDays < 30) return `${diffDays} gün kaldı`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} ay kaldı`;
    return `${Math.ceil(diffDays / 365)} yıl kaldı`;
  };

  const goalIcons = [
    { icon: 'fas fa-car', label: 'Araba' },
    { icon: 'fas fa-home', label: 'Ev' },
    { icon: 'fas fa-umbrella-beach', label: 'Tatil' },
    { icon: 'fas fa-graduation-cap', label: 'Eğitim' },
    { icon: 'fas fa-ring', label: 'Düğün' },
    { icon: 'fas fa-laptop', label: 'Teknoloji' },
    { icon: 'fas fa-heart', label: 'Sağlık' },
    { icon: 'fas fa-piggy-bank', label: 'Acil Fon' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="space-y-6" data-testid="goals-page">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Finansal Hedefler</h1>
          <p className="text-muted-foreground">Kısa ve uzun vadeli finansal hedeflerinizi belirleyin ve takip edin</p>
        </div>
        <Button 
          onClick={() => setShowGoalModal(true)}
          className="flex items-center gap-2"
          data-testid="button-add-goal"
        >
          <Plus size={16} />
          Yeni Hedef
        </Button>
      </div>

      {/* Goals Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Hedef</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-goals">
              {goals.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tamamlanan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success" data-testid="text-completed-goals">
              {goals.filter((goal: FinancialGoal) => goal.isCompleted).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Hedef Tutar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-target-amount">
              {AIService.formatCurrency(
                goals.reduce((sum: number, goal: FinancialGoal) => 
                  sum + parseFloat(goal.targetAmount), 0
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals List */}
      <Card>
        <CardHeader>
          <CardTitle>Hedefleriniz</CardTitle>
        </CardHeader>
        <CardContent>
          {goalsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : goals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground" data-testid="text-no-goals">
              Henüz finansal hedef belirlenmemiş. İlk hedefinizi oluşturun.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {goals.map((goal: FinancialGoal) => {
                const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
                const daysRemaining = getDaysRemaining(new Date(goal.targetDate));
                const isOverdue = new Date(goal.targetDate) < new Date() && !goal.isCompleted;
                
                return (
                  <div 
                    key={goal.id}
                    className="border rounded-lg p-6 hover:bg-muted/30 transition-colors"
                    data-testid={`goal-${goal.id}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${goal.color}20` }}
                        >
                          <i 
                            className={goal.icon}
                            style={{ color: goal.color }}
                          ></i>
                        </div>
                        <div>
                          <h3 className="font-semibold" data-testid={`text-goal-title-${goal.id}`}>
                            {goal.title}
                          </h3>
                          {goal.description && (
                            <p className="text-sm text-muted-foreground">{goal.description}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={isOverdue ? 'destructive' : progress >= 100 ? 'default' : 'secondary'}
                          data-testid={`badge-goal-status-${goal.id}`}
                        >
                          {goal.isCompleted ? 'Tamamlandı' : isOverdue ? 'Gecikmiş' : daysRemaining}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditGoal(goal)}
                          data-testid={`button-edit-goal-${goal.id}`}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteGoal(goal.id)}
                          disabled={deleteGoalMutation.isPending}
                          data-testid={`button-delete-goal-${goal.id}`}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>
                          Biriken: <span className="font-semibold">{AIService.formatCurrency(parseFloat(goal.currentAmount))}</span>
                        </span>
                        <span>
                          Hedef: <span className="font-semibold">{AIService.formatCurrency(parseFloat(goal.targetAmount))}</span>
                        </span>
                      </div>
                      
                      <Progress 
                        value={Math.min(100, progress)} 
                        className="h-3"
                        data-testid={`progress-goal-${goal.id}`}
                      />
                      
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>%{Math.round(progress)} tamamlandı</span>
                        <span>
                          {AIService.formatCurrency(Math.max(0, parseFloat(goal.targetAmount) - parseFloat(goal.currentAmount)))} kaldı
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Goal Creation Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Hedef Belirleme İpuçları</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="text-primary" size={16} />
              </div>
              <div>
                <h4 className="font-medium text-sm">SMART Hedefler</h4>
                <p className="text-sm text-muted-foreground">
                  Spesifik, Ölçülebilir, Ulaşılabilir, Gerçekçi ve Zamanlı hedefler belirleyin.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="text-success" size={16} />
              </div>
              <div>
                <h4 className="font-medium text-sm">Kademeli İlerleme</h4>
                <p className="text-sm text-muted-foreground">
                  Büyük hedefleri küçük, ulaşılabilir aşamalara bölün.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="text-warning" size={16} />
              </div>
              <div>
                <h4 className="font-medium text-sm">Zaman Çizelgesi</h4>
                <p className="text-sm text-muted-foreground">
                  Gerçekçi zaman dilimleri belirleyin ve düzenli gözden geçirin.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-chart-2/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="fas fa-piggy-bank text-chart-2 text-sm"></i>
              </div>
              <div>
                <h4 className="font-medium text-sm">Otomatik Tasarruf</h4>
                <p className="text-sm text-muted-foreground">
                  Hedefleriniz için otomatik tasarruf planları oluşturun.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goal Creation Modal */}
      <Dialog open={showGoalModal} onOpenChange={setShowGoalModal}>
        <DialogContent className="max-w-md" data-testid="modal-goal-creation">
          <DialogHeader>
            <DialogTitle>
              {editingGoal ? 'Hedef Düzenle' : 'Yeni Finansal Hedef'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Hedef Adı *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Örn: Araba alımı, Tatil, Acil fon"
                data-testid="input-goal-title"
              />
            </div>

            <div>
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Hedefin detayları..."
                rows={3}
                data-testid="textarea-goal-description"
              />
            </div>

            <div>
              <Label htmlFor="targetAmount">Hedef Tutar *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₺</span>
                <Input
                  id="targetAmount"
                  type="number"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: e.target.value }))}
                  placeholder="0.00"
                  className="pl-8"
                  data-testid="input-goal-amount"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="targetDate">Hedef Tarih *</Label>
              <Input
                id="targetDate"
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData(prev => ({ ...prev, targetDate: e.target.value }))}
                data-testid="input-goal-date"
              />
            </div>

            <div>
              <Label>İkon Seç</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {goalIcons.map(({ icon, label }) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, icon }))}
                    className={`p-3 rounded-lg border transition-colors ${
                      formData.icon === icon 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:bg-muted'
                    }`}
                    data-testid={`button-icon-${icon.replace(/\s+/g, '-')}`}
                  >
                    <i className={`${icon} text-lg`}></i>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setShowGoalModal(false);
                  resetForm();
                }}
                data-testid="button-cancel-goal"
              >
                İptal
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={createOrUpdateGoalMutation.isPending}
                data-testid="button-save-goal"
              >
                {createOrUpdateGoalMutation.isPending ? 'Kaydediliyor...' : (editingGoal ? 'Güncelle' : 'Kaydet')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
