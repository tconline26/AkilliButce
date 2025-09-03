import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { isUnauthorizedError } from '@/lib/authUtils';
import { apiRequest } from '@/lib/queryClient';
import { Plus, Minus } from 'lucide-react';
import { TRANSACTION_TYPES, CURRENCY } from '@/lib/constants';
import type { TransactionWithCategory } from '@/lib/types';

interface TransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: TransactionWithCategory | null;
}

export default function TransactionModal({ open, onOpenChange, transaction }: TransactionModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    description: '',
    categoryId: '',
    date: new Date().toISOString().split('T')[0],
  });

  // Populate form when editing
  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type,
        amount: transaction.amount?.toString?.() ?? String(transaction.amount ?? ''),
        description: transaction.description ?? '',
        categoryId: transaction.categoryId ?? '',
        date: new Date(transaction.date).toISOString().split('T')[0],
      });
    } else {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transaction, open]);

  const { data: categories = [] } = useQuery<Array<{ id: string; name: string; icon: string; color: string }>>({
    queryKey: ['/api/categories'],
    retry: false,
  });

  const createOrUpdateMutation = useMutation({
    mutationFn: async (transactionData: any) => {
      if (transaction?.id) {
        return apiRequest('PUT', `/api/transactions/${transaction.id}`, transactionData);
      }
      return apiRequest('POST', '/api/transactions', transactionData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions/monthly-stats'] });
      onOpenChange(false);
      resetForm();
      toast({
        title: "Başarılı",
        description: transaction?.id ? "İşlem güncellendi." : "İşlem başarıyla kaydedildi.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Hata",
        description: transaction?.id ? "İşlem güncellenirken bir hata oluştu." : "İşlem kaydedilirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      type: 'expense',
      amount: '',
      description: '',
      categoryId: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.description) {
      toast({
        title: "Hata",
        description: "Lütfen tüm zorunlu alanları doldurun.",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Hata",
        description: "Lütfen geçerli bir tutar girin.",
        variant: "destructive",
      });
      return;
    }

    createOrUpdateMutation.mutate({
      ...formData,
      amount: amount.toString(),
      categoryId: formData.categoryId || null,
    });
  };

  const filteredCategories = categories.filter((category: any) => {
    if (formData.type === 'income') {
      return category.name === 'Gelir' || category.name.toLowerCase().includes('gelir');
    }
    return category.name !== 'Gelir' && !category.name.toLowerCase().includes('gelir');
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-testid="modal-transaction">
        <DialogHeader>
          <DialogTitle>{transaction ? 'İşlemi Düzenle' : 'Yeni İşlem Ekle'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Transaction Type */}
          <div>
            <Label className="text-sm font-medium mb-2 block">İşlem Türü</Label>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={formData.type === 'income' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
                data-testid="button-type-income"
              >
                <Plus size={16} className="mr-1" />
                Gelir
              </Button>
              <Button
                type="button"
                variant={formData.type === 'expense' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
                data-testid="button-type-expense"
              >
                <Minus size={16} className="mr-1" />
                Gider
              </Button>
            </div>
          </div>
          
          {/* Amount */}
          <div>
            <Label htmlFor="amount">Tutar *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                {CURRENCY}
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0.00"
                className="pl-8"
                data-testid="input-transaction-amount"
              />
            </div>
          </div>
          
          {/* Category */}
          <div>
            <Label htmlFor="category">Kategori</Label>
            <Select 
              value={formData.categoryId} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
            >
              <SelectTrigger data-testid="select-transaction-category">
                <SelectValue placeholder="Kategori seçin" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((category: any) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <i className={category.icon} style={{ color: category.color }}></i>
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Description */}
          <div>
            <Label htmlFor="description">Açıklama *</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="İşlem açıklaması..."
              data-testid="input-transaction-description"
            />
          </div>

          {/* Date */}
          <div>
            <Label htmlFor="date">Tarih</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              data-testid="input-transaction-date"
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={() => {
                onOpenChange(false);
                resetForm();
              }}
              data-testid="button-cancel-transaction"
            >
              İptal
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={createOrUpdateMutation.isPending}
              data-testid="button-save-transaction"
            >
              {createOrUpdateMutation.isPending ? (transaction ? 'Güncelleniyor...' : 'Kaydediliyor...') : (transaction ? 'Güncelle' : 'Kaydet')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
