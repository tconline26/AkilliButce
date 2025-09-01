import { useQuery } from '@tanstack/react-query';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { TransactionWithCategory } from '@/lib/types';

export default function PieChart() {
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['/api/transactions'],
    retry: false,
  });

  const generateChartData = () => {
    const expenseTransactions = transactions.filter((t: TransactionWithCategory) => t.type === 'expense');
    const categoryTotals = new Map<string, { name: string; value: number; color: string }>();

    expenseTransactions.forEach((transaction: TransactionWithCategory) => {
      const categoryName = transaction.category?.name || 'Diğer';
      const categoryColor = transaction.category?.color || '#9E9E9E';
      const amount = parseFloat(transaction.amount);

      if (categoryTotals.has(categoryName)) {
        const existing = categoryTotals.get(categoryName)!;
        existing.value += amount;
      } else {
        categoryTotals.set(categoryName, {
          name: categoryName,
          value: amount,
          color: categoryColor
        });
      }
    });

    return Array.from(categoryTotals.values()).sort((a, b) => b.value - a.value);
  };

  const chartData = generateChartData();
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; // Don't show labels for slices smaller than 5%
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

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

  if (chartData.length === 0) {
    return (
      <div className="chart-container">
        <div className="text-center">
          <i className="fas fa-chart-pie text-4xl text-muted-foreground mb-2"></i>
          <div className="text-sm text-muted-foreground">Henüz harcama verisi yok</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="pie-chart">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`₺${value.toLocaleString('tr-TR')}`, 'Tutar']}
              labelFormatter={(label) => `Kategori: ${label}`}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {chartData.slice(0, 4).map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-sm" data-testid={`pie-legend-${index}`}>
              {item.name} {total > 0 ? `%${Math.round((item.value / total) * 100)}` : '0%'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
