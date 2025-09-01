import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PieChart from '@/components/Charts/PieChart';
import LineChart from '@/components/Charts/LineChart';

export default function AnalyticsSection() {
  return (
    <section data-testid="analytics-section">
      <h2 className="text-xl font-semibold mb-6">Analiz ve Raporlar</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Breakdown Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Harcama Dağılımı</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart />
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Aylık Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
