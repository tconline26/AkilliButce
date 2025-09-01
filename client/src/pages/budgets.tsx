import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { isUnauthorizedError } from '@/lib/authUtils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { AIService } from '@/lib/aiService';
import { apiRequest } from '@/lib/queryClient';
import type { BudgetWithCategory } from '@/lib/types';

export default function Budgets() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  // Fetch budgets
  const { data: budgets = [], isLoading: budgetsLoading } = useQuery({
    queryKey: ['/api/budgets'],
    retry: false,
  });

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories'],
    retry: false,
  });

  const getBudgetStatus = (budget: BudgetWithCategory) => {
    const spent = budget.spent || 0;
    const amount = parseFloat(budget.amount);
    const progress = AIService.calculateBudgetProgress(spent, amount);
    
    return {
      ...progress,
      spentAmount: spent,
      budgetAmount: amount,
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'danger':
        return 'bg-destructive';
      case 'warning':
        return 'bg-warning';
      default:
        return 'bg-success';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'danger':
        return 'destructive';
      case 'warning':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const totalBudget = budgets.reduce((sum: number, budget: BudgetWithCategory) => 
    sum + parseFloat(budget.amount), 0
  );

  const totalSpent = budgets.reduce((sum: number, budget: BudgetWithCategory) => 
    sum + (budget.spent || 0), 0
  );

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
    <div className="space-y-6" data-testid="budgets-page">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Bütçe Yönetimi</h1>
          <p className="text-muted-foreground">Kategori bazlı bütçelerinizi oluşturun ve takip edin</p>
        </div>
        <Button 
          className="flex items-center gap-2"
          data-testid="button-add-budget"
        >
          <Plus size={16} />
          Yeni Bütçe
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Bütçe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-budget">
              {AIService.formatCurrency(totalBudget)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Harcama</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive" data-testid="text-total-spent">
              {AIService.formatCurrency(totalSpent)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Kalan Bütçe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalBudget - totalSpent >= 0 ? 'text-success' : 'text-destructive'}`} data-testid="text-remaining-budget">
              {AIService.formatCurrency(totalBudget - totalSpent)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Genel Bütçe Durumu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Harcanan: {AIService.formatCurrency(totalSpent)}</span>
              <span>Toplam: {AIService.formatCurrency(totalBudget)}</span>
            </div>
            <Progress 
              value={totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0} 
              className="h-3"
              data-testid="progress-total-budget"
            />
            <div className="text-center text-sm text-muted-foreground">
              {totalBudget > 0 ? `%${Math.round((totalSpent / totalBudget) * 100)}` : '0%'} kullanıldı
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget List */}
      <Card>
        <CardHeader>
          <CardTitle>Kategori Bütçeleri</CardTitle>
        </CardHeader>
        <CardContent>
          {budgetsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : budgets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground" data-testid="text-no-budgets">
              Henüz bütçe belirlenmemiş. İlk bütçenizi oluşturun.
            </div>
          ) : (
            <div className="space-y-6">
              {budgets.map((budget: BudgetWithCategory) => {
                const status = getBudgetStatus(budget);
                return (
                  <div 
                    key={budget.id}
                    className="border rounded-lg p-6 hover:bg-muted/30 transition-colors"
                    data-testid={`budget-${budget.id}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${budget.category?.color}20` }}
                        >
                          <i 
                            className={`${budget.category?.icon || 'fas fa-circle'}`}
                            style={{ color: budget.category?.color }}
                          ></i>
                        </div>
                        <div>
                          <h3 className="font-semibold" data-testid={`text-budget-name-${budget.id}`}>
                            {budget.category?.name || 'Kategori Yok'}
                          </h3>
                          <p className="text-sm text-muted-foreground capitalize">
                            {budget.period} bütçe
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant={getStatusBadgeVariant(status.status)}>
                          {status.status === 'danger' ? 'Limit Aşıldı' : 
                           status.status === 'warning' ? 'Dikkat' : 'Güvenli'}
                        </Badge>
                        <Button variant="ghost" size="sm" data-testid={`button-edit-budget-${budget.id}`}>
                          <Edit size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" data-testid={`button-delete-budget-${budget.id}`}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>
                          Harcanan: <span className="font-semibold">{AIService.formatCurrency(status.spentAmount)}</span>
                        </span>
                        <span>
                          Bütçe: <span className="font-semibold">{AIService.formatCurrency(status.budgetAmount)}</span>
                        </span>
                      </div>
                      
                      <Progress 
                        value={status.percentage} 
                        className="h-2"
                        data-testid={`progress-budget-${budget.id}`}
                      />
                      
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>%{Math.round(status.percentage)} kullanıldı</span>
                        <span>
                          {status.remaining > 0 ? 
                            `${AIService.formatCurrency(status.remaining)} kaldı` : 
                            `${AIService.formatCurrency(Math.abs(status.remaining))} limit aşıldı`
                          }
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

      {/* Budget Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Bütçe İpuçları</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="fas fa-lightbulb text-primary text-sm"></i>
              </div>
              <div>
                <h4 className="font-medium text-sm">50/30/20 Kuralı</h4>
                <p className="text-sm text-muted-foreground">
                  Gelirinizin %50'si zorunlu harcamalara, %30'u isteğe bağlı harcamalara, %20'si tasarrufa ayrılmalı.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="fas fa-chart-line text-success text-sm"></i>
              </div>
              <div>
                <h4 className="font-medium text-sm">Esnek Bütçe</h4>
                <p className="text-sm text-muted-foreground">
                  Bütçenizde beklenmedik durumlar için %10-15 esneklik payı bırakın.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="fas fa-bell text-warning text-sm"></i>
              </div>
              <div>
                <h4 className="font-medium text-sm">Düzenli Takip</h4>
                <p className="text-sm text-muted-foreground">
                  Bütçenizi haftada en az bir kez gözden geçirin ve gerektiğinde ayarlayın.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-chart-2/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="fas fa-target text-chart-2 text-sm"></i>
              </div>
              <div>
                <h4 className="font-medium text-sm">Gerçekçi Hedefler</h4>
                <p className="text-sm text-muted-foreground">
                  Bütçe limitlerini geçmiş harcama alışkanlıklarınıza göre gerçekçi belirleyin.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
