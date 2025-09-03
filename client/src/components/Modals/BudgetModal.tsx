import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { isUnauthorizedError } from '@/lib/authUtils';
import { apiRequest } from '@/lib/queryClient';

interface BudgetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getCurrentMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const fmt = (d: Date) => d.toISOString().split('T')[0];
  return { start: fmt(start), end: fmt(end) };
}

export default function BudgetModal({ open, onOpenChange }: BudgetModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    categoryId: '',
    amount: '',
    period: 'monthly',
    startDate: getCurrentMonthRange().start,
    endDate: getCurrentMonthRange().end,
  });

  useEffect(() => {
    if (open) {
      setForm({
        categoryId: '',
        amount: '',
        period: 'monthly',
        startDate: getCurrentMonthRange().start,
        endDate: getCurrentMonthRange().end,
      });
    }
  }, [open]);

  const { data: categories = [] } = useQuery<Array<{ id: string; name: string; icon: string; color: string }>>({
    queryKey: ['/api/categories'],
    retry: false,
  });

  const createBudgetMutation = useMutation({
    mutationFn: async (payload: any) => {
      return apiRequest('POST', '/api/budgets', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/budgets'] });
      onOpenChange(false);
      toast({ title: 'Başarılı', description: 'Bütçe oluşturuldu.' });
    },
    onError: (error: any) => {
      if (isUnauthorizedError(error)) {
        toast({ title: 'Unauthorized', description: 'You are logged out. Logging in again...', variant: 'destructive' });
        setTimeout(() => { window.location.href = '/api/login'; }, 500);
        return;
      }
      toast({ title: 'Hata', description: 'Bütçe oluşturulamadı.', variant: 'destructive' });
    }
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount || !form.categoryId) {
      toast({ title: 'Hata', description: 'Kategori ve tutar zorunludur.', variant: 'destructive' });
      return;
    }
    const amount = parseFloat(form.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({ title: 'Hata', description: 'Geçerli bir tutar girin.', variant: 'destructive' });
      return;
    }
    createBudgetMutation.mutate({
      categoryId: form.categoryId,
      amount: amount.toString(),
      period: form.period,
      startDate: form.startDate,
      endDate: form.endDate,
      isActive: true,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-testid="modal-budget">
        <DialogHeader>
          <DialogTitle>Yeni Bütçe</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label>Kategori</Label>
            <Select value={form.categoryId} onValueChange={(v) => setForm((p) => ({ ...p, categoryId: v }))}>
              <SelectTrigger data-testid="select-budget-category">
                <SelectValue placeholder="Kategori seçin" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    <div className="flex items-center gap-2">
                      <i className={c.icon} style={{ color: c.color }}></i>
                      {c.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Tutar</Label>
            <Input
              type="number"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
              placeholder="0.00"
              data-testid="input-budget-amount"
            />
          </div>

          <div>
            <Label>Dönem</Label>
            <Select value={form.period} onValueChange={(v) => setForm((p) => ({ ...p, period: v }))}>
              <SelectTrigger data-testid="select-budget-period">
                <SelectValue placeholder="Dönem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Aylık</SelectItem>
                <SelectItem value="weekly">Haftalık</SelectItem>
                <SelectItem value="yearly">Yıllık</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label>Başlangıç Tarihi</Label>
              <Input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                data-testid="input-budget-start"
              />
            </div>
            <div>
              <Label>Bitiş Tarihi</Label>
              <Input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
                data-testid="input-budget-end"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)} data-testid="button-cancel-budget">İptal</Button>
            <Button type="submit" className="flex-1" disabled={createBudgetMutation.isPending} data-testid="button-save-budget">
              {createBudgetMutation.isPending ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
