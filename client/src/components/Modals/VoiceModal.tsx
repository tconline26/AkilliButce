import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { isUnauthorizedError } from '@/lib/authUtils';
import { apiRequest } from '@/lib/queryClient';
import { Mic, MicOff, Volume2, CheckCircle } from 'lucide-react';

interface VoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function VoiceModal({ open, onOpenChange }: VoiceModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isRecording, setIsRecording] = useState(false);
  const [voiceResult, setVoiceResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const processVoiceMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/voice/process', {});
    },
    onSuccess: (result) => {
      setVoiceResult(result.json());
      toast({
        title: "Ses Tanındı",
        description: "Ses başarıyla metne çevrildi. Sonuçları kontrol edin.",
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
        description: "Ses işleme başarısız oldu.",
        variant: "destructive",
      });
    },
  });

  const createTransactionFromVoice = useMutation({
    mutationFn: async (transactionData: any) => {
      return apiRequest('POST', '/api/transactions', {
        ...transactionData,
        source: 'voice'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions/monthly-stats'] });
      onOpenChange(false);
      setVoiceResult(null);
      setIsRecording(false);
      toast({
        title: "Başarılı",
        description: "İşlem sesli komutla kaydedildi.",
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

  const handleStartRecording = () => {
    setIsRecording(true);
    setIsProcessing(false);
    
    // Simulate recording for 3 seconds
    setTimeout(() => {
      setIsRecording(false);
      setIsProcessing(true);
      
      // Simulate voice processing
      setTimeout(() => {
        processVoiceMutation.mutate();
        setIsProcessing(false);
      }, 2000);
    }, 3000);
  };

  const handleSaveTransaction = () => {
    if (voiceResult) {
      createTransactionFromVoice.mutate({
        type: voiceResult.type,
        amount: voiceResult.amount,
        description: voiceResult.description,
        date: new Date().toISOString(),
      });
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setVoiceResult(null);
    setIsRecording(false);
    setIsProcessing(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-testid="modal-voice">
        <DialogHeader>
          <DialogTitle>Sesli Kayıt</DialogTitle>
        </DialogHeader>
        
        {!voiceResult && !isProcessing && !isRecording && (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mic className="text-warning" size={32} />
            </div>
            <h4 className="text-lg font-medium mb-2">Sesli İşlem Kaydı</h4>
            <p className="text-sm text-muted-foreground mb-6">
              Mikrofona konuşun, işleminizi otomatik olarak kaydedelim
            </p>
            
            <Button 
              onClick={handleStartRecording}
              className="w-full bg-warning hover:bg-warning/90"
              data-testid="button-start-recording"
            >
              <Mic size={16} className="mr-2" />
              Kaydı Başlat
            </Button>
          </div>
        )}

        {isRecording && (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Mic className="text-warning" size={32} />
            </div>
            <h4 className="text-lg font-medium mb-2">Dinleniyor...</h4>
            <p className="text-sm text-muted-foreground mb-6">
              Örnek: "Market alışverişi için iki yüz lira ödedim"
            </p>
            
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-warning rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-warning rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-warning rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>

            <Button 
              variant="outline"
              onClick={() => setIsRecording(false)}
              data-testid="button-stop-recording"
            >
              <MicOff size={16} className="mr-2" />
              Kaydı Durdur
            </Button>
          </div>
        )}

        {isProcessing && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h4 className="text-lg font-medium mb-2">İşleniyor...</h4>
            <p className="text-sm text-muted-foreground">
              Sesinizi metne çeviriyoruz ve analiz ediyoruz
            </p>
          </div>
        )}

        {voiceResult && (
          <div className="space-y-4">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="text-success mr-2" size={24} />
              <span className="text-lg font-medium">Ses Tanındı</span>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Volume2 className="text-muted-foreground mt-1" size={16} />
                    <div>
                      <div className="text-sm text-muted-foreground">Algılanan Metin:</div>
                      <div className="text-sm font-medium" data-testid="text-voice-transcript">
                        "{voiceResult.text}"
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tutar:</span>
                      <span className="font-semibold" data-testid="text-voice-amount">
                        ₺{voiceResult.amount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Açıklama:</span>
                      <span className="font-semibold" data-testid="text-voice-description">
                        {voiceResult.description}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tür:</span>
                      <span className="font-semibold" data-testid="text-voice-type">
                        {voiceResult.type === 'income' ? 'Gelir' : 'Gider'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Güven:</span>
                      <span className="font-semibold text-success" data-testid="text-voice-confidence">
                        %{Math.round(voiceResult.confidence * 100)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleClose}
                data-testid="button-cancel-voice"
              >
                İptal
              </Button>
              <Button 
                className="flex-1"
                onClick={handleSaveTransaction}
                disabled={createTransactionFromVoice.isPending}
                data-testid="button-save-voice-transaction"
              >
                {createTransactionFromVoice.isPending ? 'Kaydediliyor...' : 'Kaydet'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
