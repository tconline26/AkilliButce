import { useQuery } from '@tanstack/react-query';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { TURKISH_MONTHS } from '@/lib/constants';

export default function LineChart() {
  const currentYear = new Date().getFullYear();
  
  // Fetch data for last 6 months
  const monthQueries = Array.from({ length: 6 }, (_, i) => {
    const month = new Date().getMonth() - i + 1;
    const year = month <= 0 ? currentYear - 1 : currentYear;
    const adjustedMonth = month <= 0 ? month + 12 : month;
    
    return useQuery({
      queryKey: ['/api/transactions/monthly-stats', { year, month: adjustedMonth }],
      retry: false,
    });
  });

  const generateChartData = () => {
    const data = [];
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date().getMonth() - i + 1;
      const year = month <= 0 ? currentYear - 1 : currentYear;
      const adjustedMonth = month <= 0 ? month + 12 : month;
      
      const queryData = monthQueries[i]?.data;
      
      data.push({
        month: TURKISH_MONTHS[adjustedMonth - 1],
        income: queryData?.totalIncome || 0,
        expenses: queryData?.totalExpenses || 0,
      });
    }
    
    return data;
  };

  const chartData = generateChartData();
  const isLoading = monthQueries.some(query => query.isLoading);

  if (isLoading) {
    return (
      <div className="chart-container">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <div className="text-sm text-muted-foreground">Veriler yükleniyor...</div>
        </div>
      </div>
    );
  }

  const hasData = chartData.some(item => item.income > 0 || item.expenses > 0);

  if (!hasData) {
    return (
      <div className="chart-container">
        <div className="text-center">
          <i className="fas fa-chart-line text-4xl text-muted-foreground mb-2"></i>
          <div className="text-sm text-muted-foreground">Henüz trend verisi yok</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="line-chart">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => `₺${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [
                `₺${value.toLocaleString('tr-TR')}`, 
                name === 'income' ? 'Gelir' : 'Gider'
              ]}
              labelFormatter={(label) => `Ay: ${label}`}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
            />
            <Legend 
              formatter={(value) => value === 'income' ? 'Gelir' : 'Gider'}
            />
            <Line 
              type="monotone" 
              dataKey="income" 
              stroke="hsl(var(--success))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--success))', strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, stroke: 'hsl(var(--success))', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="expenses" 
              stroke="hsl(var(--destructive))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--destructive))', strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, stroke: 'hsl(var(--destructive))', strokeWidth: 2 }}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span>Gelir</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-destructive rounded-full"></div>
            <span>Gider</span>
          </div>
        </div>
        <div className="text-muted-foreground">Son 6 ay</div>
      </div>
    </div>
  );
}
