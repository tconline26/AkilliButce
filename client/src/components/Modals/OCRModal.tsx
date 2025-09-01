import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { isUnauthorizedError } from '@/lib/authUtils';
import { apiRequest } from '@/lib/queryClient';
import { Camera, Image, CheckCircle, AlertCircle } from 'lucide-react';

interface OCRModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function OCRModal({ open, onOpenChange }: OCRModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [ocrResult, setOcrResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const processOCRMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/ocr/scan', {});
    },
    onSuccess: (result) => {
      setOcrResult(result.json());
      toast({
        title: "Fiş Tarandı",
        description: "Fiş başarıyla okundu. Sonuçları kontrol edin.",
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
        description: "Fiş okuma işlemi başarısız oldu.",
        variant: "destructive",
      });
    },
  });

  const createTransactionFromOCR = useMutation({
    mutationFn: async (transactionData: any) => {
      return apiRequest('POST', '/api/transactions', {
        ...transactionData,
        source: 'ocr'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions/monthly-stats'] });
      onOpenChange(false);
      setOcrResult(null);
      toast({
        title: "Başarılı",
        description: "İşlem OCR ile kaydedildi.",
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
        description: "İşlem kaydedilirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const handleStartCamera = () => {
    setIsProcessing(true);
    // Simulate OCR processing
    setTimeout(() => {
      processOCRMutation.mutate();
      setIsProcessing(false);
    }, 2000);
  };

  const handleSaveTransaction = () => {
    if (ocrResult) {
      createTransactionFromOCR.mutate({
        type: 'expense',
        amount: ocrResult.amount,
        description: ocrResult.description,
        date: ocrResult.date,
      });
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setOcrResult(null);
    setIsProcessing(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-testid="modal-ocr">
        <DialogHeader>
          <DialogTitle>Fiş Tarama</DialogTitle>
        </DialogHeader>
        
        {!ocrResult && !isProcessing && (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-chart-2/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="text-chart-2" size={32} />
            </div>
            <h4 className="text-lg font-medium mb-2">Fişinizi Tarayın</h4>
            <p className="text-sm text-muted-foreground mb-6">
              Kamerayı fiş üzerine tutun, otomatik olarak okuyacağız
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={handleStartCamera}
                className="w-full"
                data-testid="button-start-camera"
              >
                <Camera size={16} className="mr-2" />
                Kamerayı Başlat
              </Button>
              <Button 
                variant="outline"
                className="w-full"
                data-testid="button-select-from-gallery"
              >
                <Image size={16} className="mr-2" />
                Galeriden Seç
              </Button>
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h4 className="text-lg font-medium mb-2">Fiş Okunuyor...</h4>
            <p className="text-sm text-muted-foreground">
              Lütfen bekleyin, fişinizi analiz ediyoruz
            </p>
          </div>
        )}

        {ocrResult && (
          <div className="space-y-4">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="text-success mr-2" size={24} />
              <span className="text-lg font-medium">Fiş Başarıyla Okundu</span>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tutar:</span>
                    <span className="font-semibold" data-testid="text-ocr-amount">
                      ₺{ocrResult.amount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Açıklama:</span>
                    <span className="font-semibold" data-testid="text-ocr-description">
                      {ocrResult.description}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mağaza:</span>
                    <span className="font-semibold" data-testid="text-ocr-merchant">
                      {ocrResult.merchant}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Güven:</span>
                    <span className="font-semibold text-success" data-testid="text-ocr-confidence">
                      %{Math.round(ocrResult.confidence * 100)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleClose}
                data-testid="button-cancel-ocr"
              >
                İptal
              </Button>
              <Button 
                className="flex-1"
                onClick={handleSaveTransaction}
                disabled={createTransactionFromOCR.isPending}
                data-testid="button-save-ocr-transaction"
              >
                {createTransactionFromOCR.isPending ? 'Kaydediliyor...' : 'Kaydet'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
