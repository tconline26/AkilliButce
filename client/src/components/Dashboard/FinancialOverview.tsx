import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, DollarSign, PiggyBank } from 'lucide-react';
import { AIService } from '@/lib/aiService';

export default function FinancialOverview() {
  // Fetch monthly stats
  const currentDate = new Date();
  const { data: monthlyStats } = useQuery({
    queryKey: ['/api/transactions/monthly-stats', { 
      year: currentDate.getFullYear(), 
      month: currentDate.getMonth() + 1 
    }],
    retry: false,
  });

  // Fetch previous month for comparison
  const prevMonth = currentDate.getMonth() === 0 ? 12 : currentDate.getMonth();
  const prevYear = currentDate.getMonth() === 0 ? currentDate.getFullYear() - 1 : currentDate.getFullYear();
  
  const { data: prevMonthStats } = useQuery({
    queryKey: ['/api/transactions/monthly-stats', { year: prevYear, month: prevMonth }],
    retry: false,
  });

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const financialHealthScore = monthlyStats ? 
    AIService.calculateFinancialHealthScore(
      monthlyStats.totalIncome,
      monthlyStats.totalExpenses,
      monthlyStats.balance > 0 ? (monthlyStats.balance / monthlyStats.totalIncome) * 100 : 0,
      0.8, // Mock budget adherence
      0.6  // Mock goal progress
    ) : null;

  const balanceChange = prevMonthStats ? 
    calculateChange(monthlyStats?.balance || 0, prevMonthStats.balance) : 0;

  return (
    <section data-testid="financial-overview" className="space-responsive-y">
      <div className="responsive-grid-1-3">
        {/* Balance Card */}
        <Card className="expense-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-responsive-sm font-medium text-muted-foreground flex items-center gap-2">
              <PiggyBank size={16} className="flex-shrink-0" />
              <span className="truncate">Toplam Bakiye</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-responsive-xl font-bold text-foreground mb-2" data-testid="text-total-balance">
              {AIService.formatCurrency(monthlyStats?.balance || 0)}
            </div>
            {prevMonthStats && (
              <div className="flex items-center text-xs sm:text-sm">
                {balanceChange >= 0 ? (
                  <TrendingUp className="text-success mr-1 flex-shrink-0" size={14} />
                ) : (
                  <TrendingDown className="text-destructive mr-1 flex-shrink-0" size={14} />
                )}
                <span className={balanceChange >= 0 ? 'text-success' : 'text-destructive'}>
                  {Math.abs(balanceChange).toFixed(1)}%
                </span>
                <span className="text-muted-foreground ml-1 truncate">bu ay</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Income */}
        <Card className="expense-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-responsive-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp size={16} className="flex-shrink-0" />
              <span className="truncate">Aylık Gelir</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-responsive-xl font-bold text-foreground mb-2" data-testid="text-monthly-income">
              {AIService.formatCurrency(monthlyStats?.totalIncome || 0)}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground truncate">
              {currentDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Expenses */}
        <Card className="expense-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-responsive-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign size={16} className="flex-shrink-0" />
              <span className="truncate">Aylık Gider</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-responsive-xl font-bold text-foreground mb-2" data-testid="text-monthly-expenses">
              {AIService.formatCurrency(monthlyStats?.totalExpenses || 0)}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground truncate">
              {monthlyStats?.totalIncome ? 
                `Gelirin %${Math.round((monthlyStats.totalExpenses / monthlyStats.totalIncome) * 100)}'ı` :
                'Gelir bilgisi yok'
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Health Score */}
      {financialHealthScore && (
        <Card className="financial-health-score">
          <CardHeader className="pb-4">
            <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span className="text-responsive-base">Finansal Sağlık Skoru</span>
              <div className="flex items-center space-x-2">
                <span className="text-responsive-xl font-bold text-success" data-testid="text-health-score">
                  {financialHealthScore.score}
                </span>
                <span className="text-responsive-sm text-muted-foreground">/100</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Progress 
              value={financialHealthScore.score} 
              className="h-2 sm:h-3 mb-4 sm:mb-6"
              data-testid="progress-health-score"
            />
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
              <div className="text-center">
                <div className="text-success font-semibold mb-1" data-testid="text-savings-score">
                  {financialHealthScore.factors.savings.label}
                </div>
                <div className="text-muted-foreground">Tasarruf</div>
              </div>
              <div className="text-center">
                <div className="text-success font-semibold mb-1" data-testid="text-budget-score">
                  {financialHealthScore.factors.budget.label}
                </div>
                <div className="text-muted-foreground">Bütçe</div>
              </div>
              <div className="text-center">
                <div className="text-warning font-semibold mb-1" data-testid="text-goals-score">
                  {financialHealthScore.factors.goals.label}
                </div>
                <div className="text-muted-foreground">Hedefler</div>
              </div>
              <div className="text-center">
                <div className="text-success font-semibold mb-1" data-testid="text-discipline-score">
                  {financialHealthScore.factors.discipline.label}
                </div>
                <div className="text-muted-foreground">Disiplin</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
