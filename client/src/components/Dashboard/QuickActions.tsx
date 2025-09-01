import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Camera, Mic } from 'lucide-react';
import TransactionModal from '@/components/Modals/TransactionModal';
import OCRModal from '@/components/Modals/OCRModal';
import VoiceModal from '@/components/Modals/VoiceModal';

export default function QuickActions() {
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showOCRModal, setShowOCRModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  return (
    <section data-testid="quick-actions">
      <h2 className="text-xl font-semibold mb-4">Hızlı İşlemler</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <Button
          variant="outline"
          className="h-auto p-4 text-left group hover:bg-muted"
          onClick={() => setShowTransactionModal(true)}
          data-testid="button-manual-entry"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Plus className="text-primary" size={20} />
            </div>
            <div>
              <div className="font-medium">Manuel Giriş</div>
              <div className="text-sm text-muted-foreground">Gelir veya gider ekle</div>
            </div>
          </div>
        </Button>

        <Button
          variant="outline"
          className="h-auto p-4 text-left group hover:bg-muted"
          onClick={() => setShowOCRModal(true)}
          data-testid="button-ocr-scan"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-chart-2/10 rounded-lg flex items-center justify-center group-hover:bg-chart-2/20 transition-colors">
              <Camera className="text-chart-2" size={20} />
            </div>
            <div>
              <div className="font-medium">Fiş Tara</div>
              <div className="text-sm text-muted-foreground">Kamera ile otomatik kayıt</div>
            </div>
          </div>
        </Button>

        <Button
          variant="outline"
          className="h-auto p-4 text-left group hover:bg-muted"
          onClick={() => setShowVoiceModal(true)}
          data-testid="button-voice-input"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center group-hover:bg-warning/20 transition-colors">
              <Mic className="text-warning" size={20} />
            </div>
            <div>
              <div className="font-medium">Sesli Kayıt</div>
              <div className="text-sm text-muted-foreground">Konuşarak ekle</div>
            </div>
          </div>
        </Button>
      </div>

      {/* Modals */}
      <TransactionModal
        open={showTransactionModal}
        onOpenChange={setShowTransactionModal}
      />
      <OCRModal
        open={showOCRModal}
        onOpenChange={setShowOCRModal}
      />
      <VoiceModal
        open={showVoiceModal}
        onOpenChange={setShowVoiceModal}
      />
    </section>
  );
}
