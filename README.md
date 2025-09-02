# 🏦 Akıllı Bütçe Asistanı

## 📋 İçindekiler
- [Genel Bakış](#genel-bakış)
- [Özellikler](#özellikler)
- [Teknoloji Stack](#teknoloji-stack)
- [Kurulum](#kurulum)
- [Kullanım](#kullanım)
- [API Dokümantasyonu](#api-dokümantasyonu)
- [Proje Mimarisi](#proje-mimarisi)
- [Geliştirme](#geliştirme)
- [Katkıda Bulunma](#katkıda-bulunma)
- [Lisans](#lisans)

## 🎯 Genel Bakış

**Akıllı Bütçe Asistanı**, modern web teknolojileri kullanılarak geliştirilmiş kapsamlı bir kişisel finans yönetim uygulamasıdır. Yapay zeka destekli özellikler, akıllı kategorilendirme, bütçe takibi, finansal hedefler ve gelişmiş analitikler sunarak kullanıcıların finansal sağlıklarını etkin bir şekilde yönetmelerine olanak tanır.

### 🌟 Ana Hedef
Kullanıcıların günlük finansal işlemlerini kolayca takip edebileceği, akıllı öneriler alabileceği ve finansal hedeflerine ulaşabilmesi için rehberlik sağlayan modern bir platform oluşturmak.

## ✨ Özellikler

### 🔐 Kimlik Doğrulama ve Güvenlik
- **Güvenli Giriş Sistemi**: Replit Auth entegrasyonu ile güvenli oturum yönetimi
- **Session Tabanlı Kimlik Doğrulama**: PostgreSQL destekli güvenli oturum saklama
- **Kullanıcı Profil Yönetimi**: Kişisel bilgilerin güvenli yönetimi

### 💰 Finansal İşlem Yönetimi
- **Çoklu Giriş Yöntemleri**:
  - 📝 Manuel giriş
  - 📷 OCR ile fiş tarama (geliştirilme aşamasında)
  - 🎤 Sesli komutlar (geliştirilme aşamasında)
- **Akıllı Kategorilendirme**: Yapay zeka destekli otomatik kategori önerileri
- **Gelir/Gider Takibi**: Detaylı işlem geçmişi ve analiz
- **Tekrarlanan İşlemler**: Otomatik tekrarlanan ödemeler

### 📊 Bütçe Yönetimi
- **Kategori Bazlı Bütçeler**: Her kategori için ayrı bütçe belirleme
- **Gerçek Zamanlı Takip**: Anlık harcama durumu ve uyarılar
- **Dönemsel Bütçeler**: Haftalık, aylık, yıllık bütçe planlaması
- **Görsel Raporlar**: Pie chart ve grafik destekli analiz

### 🎯 Finansal Hedefler
- **Hedef Belirleme**: Özelleştirilebilir finansal amaçlar
- **İlerleme Takibi**: Hedefe ulaşma yüzdesi ve zaman çizelgesi
- **Motivasyonel Araçlar**: Başarı rozetleri ve ilerleyiş bildirimleri

### 🤖 Yapay Zeka Özellikleri
- **Finansal Sağlık Skoru**: Gelir, gider, tasarruf oranı analizi
- **Akıllı Öneriler**: Kişiselleştirilmiş tasarruf tavsiyeleri
- **Trend Analizi**: Harcama paternleri ve gelecek projeksiyonları
- **Sohbet Asistanı**: Doğal dil ile finansal danışmanlık

### 📱 Kullanıcı Deneyimi
- **Responsive Tasarım**: Mobil ve masaüstü uyumlu arayüz
- **Karanlık/Açık Tema**: Kullanıcı tercihi destekli tema seçenekleri
- **Türkçe Dil Desteği**: Tam Türkçe arayüz ve içerik
- **Modern UI/UX**: shadcn/ui ve Tailwind CSS ile şık tasarım

## 🛠 Teknoloji Stack

### Frontend
```typescript
// Temel Framework ve Araçlar
- React 18.3.1           // Modern React framework
- TypeScript 5.6.3       // Type safety
- Vite 5.4.19            // Build tool ve dev server
- Wouter 3.3.5           // Lightweight routing

// UI ve Stilizasyon
- Tailwind CSS 3.4.17   // Utility-first CSS framework
- shadcn/ui              // Modern component library
- Radix UI               // Accessible component primitives
- Lucide React 0.453.0   // Icon library
- Framer Motion 11.13.1  // Animasyonlar

// State Management ve Data Fetching
- TanStack Query 5.60.5  // Server state management
- React Hook Form 7.55.0 // Form yönetimi
- Zod 3.24.2            // Runtime type validation

// Veri Görselleştirme
- Recharts 2.15.2       // Chart library
- Embla Carousel 8.6.0  // Carousel component
```

### Backend
```typescript
// Server Framework
- Express.js 4.21.2      // Web framework
- TypeScript 5.6.3       // Type safety

// Veritabanı
- PostgreSQL             // Ana veritabanı
- Drizzle ORM 0.39.1    // Type-safe ORM
- Drizzle Kit 0.30.4    // Schema management

// Kimlik Doğrulama
- Passport.js 0.7.0     // Authentication middleware
- OpenID Connect 6.7.1  // OIDC provider
- Express Session 1.18.1 // Session management

// Yardımcı Kütüphaneler
- date-fns 3.6.0        // Date manipulation
- ws 8.18.0             // WebSocket support
```

### DevOps ve Araçlar
```typescript
// Build ve Development
- ESBuild 0.25.0        // Fast bundler
- TSX 4.19.1            // TypeScript execution
- Vite Plugin React 4.3.2

// Code Quality
- PostCSS 8.4.47        // CSS processing
- Autoprefixer 10.4.20  // CSS vendor prefixes
```

## 📦 Kurulum

### Ön Gereksinimler
- Node.js 18+ 
- npm veya yarn
- PostgreSQL veritabanı

### 1. Proje Klonlama
```bash
git clone <repository-url>
cd akilli-butce-asistani
```

### 2. Bağımlılıkların Yüklenmesi
```bash
npm install
```

### 3. Ortam Değişkenlerinin Ayarlanması
`.env` dosyası oluşturun ve aşağıdaki değişkenleri ekleyin:
```env
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=your_session_secret_key
REPL_ID=your_replit_app_id
REPLIT_DOMAINS=your_replit_domain
ISSUER_URL=https://replit.com/oidc
```

### 4. Veritabanı Kurulumu
```bash
# Veritabanı şemasını push etme
npm run db:push
```

### 5. Uygulamayı Çalıştırma
```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

Uygulama `http://localhost:5000` adresinde çalışacaktır.

## 🚀 Kullanım

### İlk Adımlar
1. **Kayıt/Giriş**: Replit Auth ile güvenli giriş yapın
2. **Profil Oluşturma**: Kişisel bilgilerinizi tamamlayın
3. **İlk İşlem**: Manuel olarak bir gelir/gider işlemi ekleyin
4. **Bütçe Belirleme**: Kategoriler için aylık bütçeler oluşturun
5. **Hedef Koyma**: Finansal hedeflerinizi belirleyin

### Ana Özellikler

#### 💳 İşlem Ekleme
```typescript
// Manuel işlem ekleme
{
  amount: "1500.00",
  type: "expense",
  description: "Market alışverişi",
  categoryId: "category-id",
  date: "2024-01-15"
}
```

#### 📊 Bütçe Yönetimi
- Dashboard'dan bütçe durumunuzu görüntüleyin
- Kategori bazlı harcama limitlerini belirleyin
- Gerçek zamanlı uyarılar alın

#### 🎯 Finansal Hedefler
- Kısa ve uzun vadeli hedefler oluşturun
- İlerlemenizi takip edin
- Hedefe ulaşma stratejileri alın

## 📡 API Dokümantasyonu

### Kimlik Doğrulama Endpoint'leri
```http
GET /api/auth/user
Authorization: Session-based
Response: User object
```

### İşlem Endpoint'leri
```http
# Tüm işlemleri getirme
GET /api/transactions?limit=50
Authorization: Required

# Yeni işlem oluşturma
POST /api/transactions
Content-Type: application/json
{
  "amount": "100.00",
  "type": "expense",
  "description": "Açıklama",
  "categoryId": "uuid"
}

# Aylık istatistikler
GET /api/transactions/monthly-stats?year=2024&month=1
```

### Bütçe Endpoint'leri
```http
# Kullanıcı bütçeleri
GET /api/budgets

# Yeni bütçe oluşturma
POST /api/budgets
{
  "categoryId": "uuid",
  "amount": "1000.00",
  "period": "monthly",
  "startDate": "2024-01-01",
  "endDate": "2024-01-31"
}
```

### Finansal Hedefler
```http
# Hedefleri getirme
GET /api/goals

# Yeni hedef oluşturma
POST /api/goals
{
  "title": "Araba",
  "targetAmount": "50000.00",
  "targetDate": "2024-12-31",
  "icon": "car",
  "color": "#3B82F6"
}
```

### AI Asistan
```http
# Chat mesajları
GET /api/chat/messages

# Yeni mesaj gönderme
POST /api/chat/messages
{
  "message": "Bu ay ne kadar harcadım?",
  "isFromUser": true
}
```

## 🏗 Proje Mimarisi

### Dosya Yapısı
```
akilli-butce-asistani/
├── client/                     # Frontend uygulaması
│   ├── src/
│   │   ├── components/         # React bileşenleri
│   │   │   ├── Dashboard/      # Dashboard bileşenleri
│   │   │   ├── Charts/         # Chart bileşenleri
│   │   │   ├── Modals/         # Modal bileşenleri
│   │   │   └── ui/             # shadcn/ui bileşenleri
│   │   ├── hooks/              # Custom hooks
│   │   ├── lib/                # Yardımcı fonksiyonlar
│   │   ├── pages/              # Sayfa bileşenleri
│   │   ├── App.tsx             # Ana uygulama
│   │   └── main.tsx            # Entry point
│   └── index.html
├── server/                     # Backend uygulaması
│   ├── db.ts                   # Veritabanı bağlantısı
│   ├── storage.ts              # Veri erişim katmanı
│   ├── routes.ts               # API route'ları
│   ├── replitAuth.ts          # Authentication logic
│   └── index.ts                # Server entry point
├── shared/                     # Paylaşılan tipler
│   └── schema.ts              # Drizzle schema ve tipler
├── package.json               # Bağımlılıklar
├── vite.config.ts            # Vite konfigürasyonu
├── tailwind.config.ts        # Tailwind konfigürasyonu
└── drizzle.config.ts         # Drizzle konfigürasyonu
```

### Veritabanı Şeması

#### Kullanıcılar (users)
- `id`: Benzersiz kullanıcı kimliği
- `email`: E-posta adresi
- `firstName`, `lastName`: İsim bilgileri
- `profileImageUrl`: Profil fotoğrafı

#### İşlemler (transactions)
- `id`: İşlem kimliği
- `userId`: Kullanıcı referansı
- `amount`: Miktar (decimal)
- `type`: Tür (income/expense)
- `description`: Açıklama
- `categoryId`: Kategori referansı
- `source`: Giriş yöntemi (manual/ocr/voice/ai)

#### Kategoriler (categories)
- `id`: Kategori kimliği
- `name`: Kategori adı
- `icon`: İkon adı
- `color`: Renk kodu
- `isDefault`: Varsayılan kategori mi

#### Bütçeler (budgets)
- `id`: Bütçe kimliği
- `userId`: Kullanıcı referansı
- `categoryId`: Kategori referansı
- `amount`: Bütçe miktarı
- `period`: Dönem (monthly/weekly/yearly)
- `startDate`, `endDate`: Başlangıç ve bitiş tarihleri

### Mimari Prensipler

#### Frontend Mimarisi
- **Component-Based**: Modüler React bileşenleri
- **Type Safety**: TypeScript ile tip güvenliği
- **State Management**: TanStack Query ile server state
- **Responsive Design**: Mobile-first yaklaşım

#### Backend Mimarisi
- **RESTful API**: Standard HTTP metodları
- **Type-Safe ORM**: Drizzle ORM ile tip güvenli veritabanı işlemleri
- **Session Management**: PostgreSQL destekli session store
- **Error Handling**: Merkezi hata yönetimi

#### Güvenlik
- **Authentication**: OpenID Connect standardı
- **Authorization**: Route-level koruma
- **Data Validation**: Zod ile runtime validation
- **SQL Injection Protection**: ORM kullanımı

## 🔧 Geliştirme

### Geliştirme Ortamı Kurulumu
```bash
# Development server'ı başlatma
npm run dev

# Type checking
npm run check

# Veritabanı değişikliklerini push etme
npm run db:push
```

### Code Style ve Standartlar
- **TypeScript**: Strict mode kullanımı
- **ESLint**: Code quality kontrolü
- **Prettier**: Code formatting
- **Conventional Commits**: Commit message standardı

### Testing
```bash
# Unit testler (geliştirilecek)
npm run test

# E2E testler (geliştirilecek)  
npm run test:e2e
```

### Yeni Özellik Ekleme

#### 1. Veritabanı Şeması Güncelleme
```typescript
// shared/schema.ts dosyasında yeni tablo ekleme
export const newTable = pgTable("new_table", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // diğer alanlar...
});
```

#### 2. Storage Interface Güncelleme
```typescript
// server/storage.ts
export interface IStorage {
  // yeni metodlar...
  getNewData(userId: string): Promise<NewData[]>;
  createNewData(data: InsertNewData): Promise<NewData>;
}
```

#### 3. API Route Ekleme
```typescript
// server/routes.ts
app.get('/api/new-endpoint', isAuthenticated, async (req: any, res) => {
  // implementation...
});
```

#### 4. Frontend Component Oluşturma
```typescript
// client/src/components/NewComponent.tsx
export default function NewComponent() {
  const { data } = useQuery({
    queryKey: ['/api/new-endpoint']
  });
  
  return <div>{/* component content */}</div>;
}
```

## 🤝 Katkıda Bulunma

### Katkı Süreci
1. **Fork**: Projeyi fork edin
2. **Branch**: Yeni feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. **Commit**: Değişikliklerinizi commit edin (`git commit -m 'feat: add amazing feature'`)
4. **Push**: Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. **Pull Request**: Pull request oluşturun

### Commit Mesaj Formatı
```
type(scope): description

feat: yeni özellik ekleme
fix: bug düzeltme
docs: dokümantasyon değişikliği
style: kod formatı değişikliği
refactor: kod refactoring
test: test ekleme/düzenleme
chore: build process veya auxiliary tools değişikliği
```

### Kod Kalitesi
- **Type Safety**: Tüm kodlar TypeScript ile yazılmalı
- **Component Naming**: PascalCase kullanımı
- **File Structure**: Modüler dosya organizasyonu
- **Performance**: React best practices

### Issue Raporlama
Bug raporu veya özellik isteği için aşağıdaki bilgileri paylaşın:
- **Ortam**: Browser, OS, Node.js versiyonu
- **Adımlar**: Hatayı reproduce etme adımları
- **Beklenen Davranış**: Ne olmasını bekliyorsunuz
- **Gerçek Davranış**: Ne oluyor
- **Ekran Görüntüsü**: Varsa ekleyin

## 🔮 Gelecek Özellikler

### Kısa Vadeli (v1.1)
- [ ] OCR ile fiş tarama entegrasyonu
- [ ] Sesli komut desteği
- [ ] Gelişmiş AI önerileri
- [ ] Export/Import özellikleri

### Orta Vadeli (v1.2)
- [ ] Mobil uygulama (React Native)
- [ ] Çoklu para birimi desteği
- [ ] Banka API entegrasyonları
- [ ] Gelişmiş raporlama

### Uzun Vadeli (v2.0)
- [ ] Machine Learning ile harcama tahmini
- [ ] Sosyal özellikler (aile bütçesi)
- [ ] Yatırım takibi
- [ ] Kripto para desteği

## 📄 Lisans

Bu proje MIT Lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakınız.

## 📞 İletişim

- **Email**: [email@example.com]
- **GitHub**: [https://github.com/username/akilli-butce-asistani]
- **Demo**: [https://akilli-butce-asistani.replit.app]

## 🙏 Teşekkürler

Bu projenin geliştirilmesinde kullanılan açık kaynak projelere ve topluluğa teşekkürler:

- [React](https://reactjs.org/) - UI library
- [Express.js](https://expressjs.com/) - Web framework
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Recharts](https://recharts.org/) - Chart library

---

**Akıllı Bütçe Asistanı** - Finansal geleceğinizi akıllıca planlayın! 🚀