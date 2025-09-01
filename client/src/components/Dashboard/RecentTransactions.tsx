import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';
import { AIService } from '@/lib/aiService';
import type { TransactionWithCategory } from '@/lib/types';

export default function RecentTransactions() {
  const [, navigate] = useLocation();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['/api/transactions', { limit: 5 }],
    retry: false,
  });

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'ai':
        return <i className="fas fa-robot text-primary text-xs" />;
      case 'ocr':
        return <i className="fas fa-camera text-chart-2 text-xs" />;
      case 'voice':
        return <i className="fas fa-microphone text-warning text-xs" />;
      default:
        return <i className="fas fa-edit text-muted-foreground text-xs" />;
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'ai': return 'AI';
      case 'ocr': return 'OCR';
      case 'voice': return 'Sesli';
      default: return 'Manuel';
    }
  };

  return (
    <section data-testid="recent-transactions">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Son İşlemler</span>
            <Button 
              variant="link" 
              size="sm"
              onClick={() => navigate('/transactions')}
              data-testid="button-view-all-transactions"
            >
              Tümünü Gör
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground" data-testid="text-no-recent-transactions">
              Henüz işlem bulunmamaktadır.
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction: TransactionWithCategory) => (
                <div 
                  key={transaction.id}
                  className="expense-card bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                  data-testid={`recent-transaction-${transaction.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        transaction.type === 'income' ? 'bg-success/10' : 'bg-destructive/10'
                      }`}>
                        <i className={`${transaction.category?.icon || 'fas fa-circle'} ${
                          transaction.type === 'income' ? 'text-success' : 'text-destructive'
                        }`}></i>
                      </div>
                      <div>
                        <div className="font-medium" data-testid={`text-transaction-description-${transaction.id}`}>
                          {transaction.description}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {transaction.category?.name || 'Kategori Yok'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {AIService.formatDate(new Date(transaction.date))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${
                        transaction.type === 'income' ? 'text-success' : 'text-destructive'
                      }`} data-testid={`text-transaction-amount-${transaction.id}`}>
                        {transaction.type === 'income' ? '+' : '-'}
                        {AIService.formatCurrency(parseFloat(transaction.amount))}
                      </div>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {getSourceIcon(transaction.source)}
                        <span className="ml-1">{getSourceLabel(transaction.source)}</span>
                      </Badge>
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
