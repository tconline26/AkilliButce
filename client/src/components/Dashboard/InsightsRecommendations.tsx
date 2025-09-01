import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, AlertTriangle, TrendingUp, Target } from 'lucide-react';
import type { AiInsight } from '@shared/schema';

export default function InsightsRecommendations() {
  const { data: insights = [], isLoading } = useQuery({
    queryKey: ['/api/insights'],
    retry: false,
  });

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'saving_tip':
        return <Lightbulb className="text-success" size={16} />;
      case 'budget_warning':
        return <AlertTriangle className="text-warning" size={16} />;
      case 'trend_analysis':
        return <TrendingUp className="text-chart-2" size={16} />;
      case 'goal_suggestion':
        return <Target className="text-chart-4" size={16} />;
      default:
        return <Lightbulb className="text-muted-foreground" size={16} />;
    }
  };

  const getInsightTitle = (type: string) => {
    switch (type) {
      case 'saving_tip':
        return 'Tasarruf Önerisi';
      case 'budget_warning':
        return 'Bütçe Uyarısı';
      case 'trend_analysis':
        return 'Trend Analizi';
      case 'goal_suggestion':
        return 'Hedef Önerisi';
      default:
        return 'Öneri';
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'saving_tip':
        return 'border-success/20 border-l-success';
      case 'budget_warning':
        return 'border-warning/20 border-l-warning';
      case 'trend_analysis':
        return 'border-chart-2/20 border-l-chart-2';
      case 'goal_suggestion':
        return 'border-chart-4/20 border-l-chart-4';
      default:
        return 'border-muted/20 border-l-muted';
    }
  };

  // Mock insights if none from API
  const mockInsights = [
    {
      id: 'mock-1',
      type: 'saving_tip',
      title: 'Tasarruf Önerisi',
      content: 'Hafta sonu ev yemekleri yaparak aylık ₺400 tasarruf edebilirsiniz. Restoran harcamalarınız ortalamanın %40 üzerinde.',
      priority: 1
    },
    {
      id: 'mock-2',
      type: 'budget_warning',
      title: 'Bütçe Uyarısı',
      content: 'Eğlence kategorisinde ay sonuna 10 gün kala bütçenizin %53\'ünü kullandınız. Dikkatli harcayın.',
      priority: 2
    },
    {
      id: 'mock-3',
      type: 'trend_analysis',
      title: 'Trend Analizi',
      content: 'Son 3 ayda ulaşım harcamalarınız %15 azaldı. Bu tempo devam ederse yıllık ₺2,000 tasarruf edeceksiniz.',
      priority: 1
    },
    {
      id: 'mock-4',
      type: 'goal_suggestion',
      title: 'Hedef Önerisi',
      content: 'Acil durum fonu oluşturmayı düşünün. Aylık giderinizin 3 katı ideal olacaktır.',
      priority: 1
    }
  ];

  const displayInsights = insights.length > 0 ? insights : mockInsights;

  return (
    <section data-testid="insights-recommendations">
      <Card>
        <CardHeader>
          <CardTitle>Kişisel Öneriler</CardTitle>
          <p className="text-sm text-muted-foreground">
            AI destekli finansal öneriler ve analizler
          </p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayInsights.slice(0, 4).map((insight: any) => (
                <div 
                  key={insight.id}
                  className={`insight-card border ${getInsightColor(insight.type)} border-l-4 rounded-lg p-4`}
                  data-testid={`insight-${insight.id}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      insight.type === 'saving_tip' ? 'bg-success/10' :
                      insight.type === 'budget_warning' ? 'bg-warning/10' :
                      insight.type === 'trend_analysis' ? 'bg-chart-2/10' :
                      'bg-chart-4/10'
                    }`}>
                      {getInsightIcon(insight.type)}
                    </div>
                    <div>
                      <h4 className={`font-medium mb-1 ${
                        insight.type === 'saving_tip' ? 'text-success' :
                        insight.type === 'budget_warning' ? 'text-warning' :
                        insight.type === 'trend_analysis' ? 'text-chart-2' :
                        'text-chart-4'
                      }`} data-testid={`text-insight-title-${insight.id}`}>
                        {getInsightTitle(insight.type)}
                      </h4>
                      <p className="text-sm text-muted-foreground" data-testid={`text-insight-content-${insight.id}`}>
                        {insight.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
