import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { AIService } from '@/lib/aiService';
import type { FinancialGoal } from '@shared/schema';

export default function FinancialGoals() {
  const [, navigate] = useLocation();

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['/api/goals'],
    retry: false,
  });

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

  return (
    <section data-testid="financial-goals">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Finansal Hedefler</span>
            <Button 
              variant="link" 
              size="sm"
              onClick={() => navigate('/goals')}
              data-testid="button-add-new-goal"
            >
              + Yeni Hedef
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : goals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground" data-testid="text-no-goals">
              Henüz finansal hedef belirlenmemiş.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {goals.slice(0, 2).map((goal: FinancialGoal) => {
                const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
                const daysRemaining = getDaysRemaining(new Date(goal.targetDate));
                const isOverdue = new Date(goal.targetDate) < new Date() && !goal.isCompleted;
                
                return (
                  <div 
                    key={goal.id}
                    className="border rounded-lg p-6 hover:bg-muted/30 transition-colors"
                    data-testid={`financial-goal-${goal.id}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <i 
                          className={goal.icon}
                          style={{ color: goal.color }}
                        ></i>
                        <span className="font-medium" data-testid={`text-goal-title-${goal.id}`}>
                          {goal.title}
                        </span>
                      </div>
                      <Badge 
                        variant={isOverdue ? 'destructive' : 'secondary'}
                        className="text-xs"
                        data-testid={`badge-goal-deadline-${goal.id}`}
                      >
                        {daysRemaining}
                      </Badge>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">İlerleme</span>
                        <span data-testid={`text-goal-progress-${goal.id}`}>
                          {Math.round(progress)}%
                        </span>
                      </div>
                      <Progress 
                        value={Math.min(100, progress)} 
                        className="h-2"
                        data-testid={`progress-goal-${goal.id}`}
                      />
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Biriken: <span data-testid={`text-goal-current-${goal.id}`}>
                          {AIService.formatCurrency(parseFloat(goal.currentAmount))}
                        </span>
                      </span>
                      <span className="text-muted-foreground">
                        Hedef: <span data-testid={`text-goal-target-${goal.id}`}>
                          {AIService.formatCurrency(parseFloat(goal.targetAmount))}
                        </span>
                      </span>
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
