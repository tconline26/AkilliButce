import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { AIService } from '@/lib/aiService';
import type { BudgetWithCategory } from '@/lib/types';

export default function BudgetOverview() {
  const [, navigate] = useLocation();

  const { data: budgets = [], isLoading } = useQuery({
    queryKey: ['/api/budgets'],
    retry: false,
  });

  return (
    <section data-testid="budget-overview">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Bütçe Durumu</span>
            <Button 
              variant="link" 
              size="sm"
              onClick={() => navigate('/budgets')}
              data-testid="button-manage-budgets"
            >
              Düzenle
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : budgets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground" data-testid="text-no-budgets">
              Henüz bütçe belirlenmemiş.
            </div>
          ) : (
            <div className="space-y-4">
              {budgets.slice(0, 3).map((budget: BudgetWithCategory) => {
                const spent = budget.spent || 0;
                const amount = parseFloat(budget.amount);
                const progress = AIService.calculateBudgetProgress(spent, amount);
                
                return (
                  <div 
                    key={budget.id}
                    className="bg-muted/30 rounded-lg p-4"
                    data-testid={`budget-overview-${budget.id}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <i 
                          className={`${budget.category?.icon || 'fas fa-circle'}`}
                          style={{ color: budget.category?.color }}
                        ></i>
                        <span className="font-medium" data-testid={`text-budget-category-${budget.id}`}>
                          {budget.category?.name || 'Kategori Yok'}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span data-testid={`text-budget-spent-${budget.id}`}>
                          {AIService.formatCurrency(spent)}
                        </span>
                        {' / '}
                        <span data-testid={`text-budget-amount-${budget.id}`}>
                          {AIService.formatCurrency(amount)}
                        </span>
                      </div>
                    </div>
                    <Progress 
                      value={progress.percentage} 
                      className="h-2 mb-1"
                      data-testid={`progress-budget-${budget.id}`}
                    />
                    <div className="text-xs text-muted-foreground" data-testid={`text-budget-remaining-${budget.id}`}>
                      {progress.remaining > 0 
                        ? `${AIService.formatCurrency(progress.remaining)} kaldı`
                        : `${AIService.formatCurrency(Math.abs(progress.remaining))} limit aşıldı`
                      }
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
