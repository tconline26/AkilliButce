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
    <section data-testid="financial-overview">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Balance Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <PiggyBank size={16} />
              Toplam Bakiye
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground" data-testid="text-total-balance">
              {AIService.formatCurrency(monthlyStats?.balance || 0)}
            </div>
            {prevMonthStats && (
              <div className="flex items-center mt-2 text-sm">
                {balanceChange >= 0 ? (
                  <TrendingUp className="text-success mr-1" size={16} />
                ) : (
                  <TrendingDown className="text-destructive mr-1" size={16} />
                )}
                <span className={balanceChange >= 0 ? 'text-success' : 'text-destructive'}>
                  {Math.abs(balanceChange).toFixed(1)}%
                </span>
                <span className="text-muted-foreground ml-1">bu ay</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Income */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp size={16} />
              Aylık Gelir
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground" data-testid="text-monthly-income">
              {AIService.formatCurrency(monthlyStats?.totalIncome || 0)}
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              {currentDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Expenses */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign size={16} />
              Aylık Gider
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground" data-testid="text-monthly-expenses">
              {AIService.formatCurrency(monthlyStats?.totalExpenses || 0)}
            </div>
            <div className="text-sm text-muted-foreground mt-2">
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
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Finansal Sağlık Skoru</span>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-success" data-testid="text-health-score">
                  {financialHealthScore.score}
                </span>
                <span className="text-sm text-muted-foreground">/100</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress 
              value={financialHealthScore.score} 
              className="h-3 mb-4"
              data-testid="progress-health-score"
            />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-success font-semibold" data-testid="text-savings-score">
                  {financialHealthScore.factors.savings.label}
                </div>
                <div className="text-muted-foreground">Tasarruf</div>
              </div>
              <div className="text-center">
                <div className="text-success font-semibold" data-testid="text-budget-score">
                  {financialHealthScore.factors.budget.label}
                </div>
                <div className="text-muted-foreground">Bütçe</div>
              </div>
              <div className="text-center">
                <div className="text-warning font-semibold" data-testid="text-goals-score">
                  {financialHealthScore.factors.goals.label}
                </div>
                <div className="text-muted-foreground">Hedefler</div>
              </div>
              <div className="text-center">
                <div className="text-success font-semibold" data-testid="text-discipline-score">
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
