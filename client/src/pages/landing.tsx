import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Wallet, 
  Brain, 
  Camera, 
  Mic, 
  PieChart, 
  Target, 
  Shield, 
  Smartphone,
  TrendingUp,
  Users
} from 'lucide-react';

export default function Landing() {
  const features = [
    {
      icon: <Brain className="h-8 w-8 text-primary" />,
      title: "AI Destekli Kategorilendirme",
      description: "Yapay zeka ile otomatik işlem kategorizasyonu ve akıllı harcama analizi"
    },
    {
      icon: <Camera className="h-8 w-8 text-chart-2" />,
      title: "OCR Fiş Tarama",
      description: "Fişlerinizi fotoğraflayın, otomatik olarak okuyup kayıt edelim"
    },
    {
      icon: <Mic className="h-8 w-8 text-warning" />,
      title: "Sesli Komutlar",
      description: "Sesli komutlarla hızlı gelir ve gider kaydı yapabilirsiniz"
    },
    {
      icon: <PieChart className="h-8 w-8 text-chart-4" />,
      title: "Detaylı Analitik",
      description: "Görsel raporlar ve trendlerle finansal durumunuzu takip edin"
    },
    {
      icon: <Target className="h-8 w-8 text-chart-5" />,
      title: "Finansal Hedefler",
      description: "Kısa ve uzun vadeli hedeflerinizi belirleyin ve takip edin"
    },
    {
      icon: <Shield className="h-8 w-8 text-success" />,
      title: "Güvenli & Özel",
      description: "Verileriniz güvenli şekilde saklanır ve gizliliğiniz korunur"
    }
  ];

  const stats = [
    { value: "10K+", label: "Aktif Kullanıcı" },
    { value: "₺5M+", label: "Takip Edilen Bütçe" },
    { value: "25%", label: "Ortalama Tasarruf Artışı" },
    { value: "4.9/5", label: "Kullanıcı Memnuniyeti" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-chart-2 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Wallet className="text-white" size={40} />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
            Akıllı Bütçe Asistanı
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Finansal hayatınızı kontrol altına alın. Yapay zeka destekli bütçe yönetimi 
            ile tasarruf edin ve hedeflerinize ulaşın.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => window.location.href = '/api/login'}
              data-testid="button-login"
            >
              Hemen Başlayın
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6"
              data-testid="button-learn-more"
            >
              Daha Fazla Bilgi
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-card/50 backdrop-blur-sm border-y border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Neden Akıllı Bütçe?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Modern teknoloji ile finansal yönetimi basit, etkili ve keyifli hale getiren 
            özelliklerimizi keşfedin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200 border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-muted rounded-lg w-fit">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nasıl Çalışır?
            </h2>
            <p className="text-xl text-muted-foreground">
              Sadece 3 adımda finansal kontrolü elinize alın
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Kayıt Olun</h3>
              <p className="text-muted-foreground">
                Hesap oluşturun ve temel bilgilerinizi girin
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-chart-2 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Harcamalarınızı Ekleyin</h3>
              <p className="text-muted-foreground">
                Manuel, OCR veya sesli komutlarla işlemlerinizi kaydedin
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-warning rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Analiz Edin</h3>
              <p className="text-muted-foreground">
                AI destekli öneriler ile finansal sağlığınızı iyileştirin
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-br from-primary/10 to-chart-2/10 border-primary/20">
          <CardContent className="text-center py-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Finansal Geleceğinizi Şekillendirin
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Bugün başlayın ve yapay zeka destekli bütçe yönetimi ile 
              finansal hedeflerinize daha hızlı ulaşın.
            </p>
            <Button 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => window.location.href = '/api/login'}
              data-testid="button-get-started"
            >
              Ücretsiz Başlayın
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Wallet className="text-primary-foreground" size={16} />
              </div>
              <span className="text-lg font-semibold">Akıllı Bütçe</span>
            </div>
            
            <div className="text-muted-foreground text-sm">
              © 2024 Akıllı Bütçe Asistanı. Tüm hakları saklıdır.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
