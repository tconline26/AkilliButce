import { useState } from 'react';
import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { isUnauthorizedError } from '@/lib/authUtils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Search, Plus, Filter, Download } from 'lucide-react';
import TransactionModal from '@/components/Modals/TransactionModal';
import { AIService } from '@/lib/aiService';
import { CURRENCY } from '@/lib/constants';
import type { TransactionWithCategory } from '@/lib/types';

export default function Transactions() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

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

  // Fetch transactions
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ['/api/transactions'],
    retry: false,
  });

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories'],
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
      case 'ai':
        return 'AI';
      case 'ocr':
        return 'OCR';
      case 'voice':
        return 'Sesli';
      default:
        return 'Manuel';
    }
  };

  const filteredTransactions = transactions.filter((transaction: TransactionWithCategory) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesCategory = filterCategory === 'all' || transaction.categoryId === filterCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  const totalIncome = transactions
    .filter((t: TransactionWithCategory) => t.type === 'income')
    .reduce((sum: number, t: TransactionWithCategory) => sum + parseFloat(t.amount), 0);

  const totalExpenses = transactions
    .filter((t: TransactionWithCategory) => t.type === 'expense')
    .reduce((sum: number, t: TransactionWithCategory) => sum + parseFloat(t.amount), 0);

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
    <div className="space-y-6" data-testid="transactions-page">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">İşlemler</h1>
          <p className="text-muted-foreground">Tüm gelir ve giderlerinizi görüntüleyin ve yönetin</p>
        </div>
        <Button 
          onClick={() => setShowTransactionModal(true)}
          className="flex items-center gap-2"
          data-testid="button-add-transaction"
        >
          <Plus size={16} />
          Yeni İşlem
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Gelir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success" data-testid="text-total-income">
              {AIService.formatCurrency(totalIncome)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Gider</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive" data-testid="text-total-expenses">
              {AIService.formatCurrency(totalExpenses)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Net Bakiye</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-success' : 'text-destructive'}`} data-testid="text-net-balance">
              {AIService.formatCurrency(totalIncome - totalExpenses)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  placeholder="İşlem ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-transactions"
                />
              </div>
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48" data-testid="select-filter-type">
                <SelectValue placeholder="Tür seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm İşlemler</SelectItem>
                <SelectItem value="income">Gelir</SelectItem>
                <SelectItem value="expense">Gider</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-48" data-testid="select-filter-category">
                <SelectValue placeholder="Kategori seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Kategoriler</SelectItem>
                {categories.map((category: any) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>İşlem Geçmişi</span>
            <Button variant="outline" size="sm" data-testid="button-export">
              <Download size={16} className="mr-2" />
              Dışa Aktar
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactionsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground" data-testid="text-no-transactions">
              {searchTerm || filterType !== 'all' || filterCategory !== 'all' 
                ? 'Filtre kriterlerinize uygun işlem bulunamadı.'
                : 'Henüz işlem bulunmamaktadır. İlk işleminizi ekleyin.'
              }
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((transaction: TransactionWithCategory) => (
                <div 
                  key={transaction.id}
                  className="expense-card bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  data-testid={`transaction-${transaction.id}`}
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
                        <div className="font-medium" data-testid={`text-description-${transaction.id}`}>
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
                      }`} data-testid={`text-amount-${transaction.id}`}>
                        {transaction.type === 'income' ? '+' : '-'}{AIService.formatCurrency(parseFloat(transaction.amount))}
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

      {/* Transaction Modal */}
      <TransactionModal
        open={showTransactionModal}
        onOpenChange={setShowTransactionModal}
      />
    </div>
  );
}
