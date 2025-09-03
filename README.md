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
- **Güvenli Giriş Sistemi**: Express Session ile güvenli oturum yönetimi
- **Session Tabanlı Kimlik Doğrulama**: PostgreSQL destekli güvenli oturum saklama
- **Kullanıcı Profil Yönetimi**: Kişisel bilgilerin güvenli yönetimi
- **Şifre Güvenliği**: bcrypt ile hash'lenmiş şifre saklama
- **CSRF Koruması**: Cross-site request forgery koruması

### 💰 Finansal İşlem Yönetimi
- **Çoklu Giriş Yöntemleri**:
  - 📝 Manuel giriş (Aktif)
  - 📷 OCR ile fiş tarama (Mock implementasyon)
  - 🎤 Sesli komutlar (Mock implementasyon)
- **Akıllı Kategorilendirme**: Yapay zeka destekli otomatik kategori önerileri
- **Gelir/Gider Takibi**: Detaylı işlem geçmişi ve analiz
- **İşlem CRUD Operasyonları**: Tam oluşturma, okuma, güncelleme, silme desteği
- **Gerçek Zamanlı Güncelleme**: TanStack Query ile otomatik veri senkronizasyonu

### 📊 Bütçe Yönetimi
- **Kategori Bazlı Bütçeler**: Her kategori için ayrı bütçe belirleme
- **Gerçek Zamanlı Takip**: Anlık harcama durumu ve uyarılar
- **Dönemsel Bütçeler**: Haftalık, aylık, yıllık bütçe planlaması
- **Görsel Raporlar**: Pie chart ve grafik destekli analiz
- **Bütçe Aşım Uyarıları**: Otomatik bildirimler

### 🎯 Finansal Hedefler
- **Hedef Belirleme**: Özelleştirilebilir finansal amaçlar
- **İlerleme Takibi**: Hedefe ulaşma yüzdesi ve zaman çizelgesi
- **Hedef CRUD İşlemleri**: Tam hedef yönetimi (oluşturma, düzenleme, silme)
- **Görsel İlerleme**: Progress bar'lar ve durum göstergeleri
- **Hedef Kategorileri**: İkon ve renk destekli hedef sınıflandırması

### 🤖 Yapay Zeka Özellikleri
- **Finansal Sağlık Skoru**: Gelir, gider, tasarruf oranı analizi
- **Akıllı Öneriler**: Kişiselleştirilmiş tasarruf tavsiyeleri
- **Trend Analizi**: Harcama paternleri ve gelecek projeksiyonları
- **Sohbet Asistanı**: Doğal dil ile finansal danışmanlık
- **Otomatik Kategorilendirme**: Açıklama bazlı akıllı kategori önerisi

### 📱 Kullanıcı Deneyimi
- **Mobil Öncelikli Tasarım**: Mobile-first responsive yaklaşım
- **Minimalist ve Modern Tasarım**: Temiz, odaklanmış arayüz
- **Tamamen Responsive**: Mobil, tablet, masaüstü uyumlu
- **Karanlık/Açık Tema**: Kullanıcı tercihi destekli tema seçenekleri
- **Türkçe Dil Desteği**: Tam Türkçe arayüz ve içerik
- **Modern UI/UX**: shadcn/ui ve Tailwind CSS ile şık tasarım
- **Gelişmiş Animasyonlar**: Smooth transitions ve hover efektleri
- **Touch-Friendly**: Mobil cihazlar için optimize edilmiş dokunma hedefleri

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

// Veritabanı ve ORM
- PostgreSQL 16+         // Ana veritabanı
- Drizzle ORM 0.39.1    // Type-safe ORM
- Drizzle Kit 0.30.4    // Schema management ve migrations
- pg 8.13.1             // PostgreSQL client
- connect-pg-simple     // PostgreSQL session store

// Kimlik Doğrulama ve Güvenlik
- Express Session 1.18.1 // Session management
- bcryptjs 2.4.3        // Password hashing
- CORS                  // Cross-origin resource sharing
- Helmet                // Security headers

// Yardımcı Kütüphaneler
- Zod 3.24.2            // Runtime type validation
- date-fns 3.6.0        // Date manipulation
```

### 🗄️ PostgreSQL Veritabanı Entegrasyonu

#### Veritabanı Yapılandırması
```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './shared/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

#### Session Store Yapılandırması
```typescript
// PostgreSQL destekli session store
const pgStore = connectPg(session);
const sessionStore = new pgStore({
  conString: process.env.DATABASE_URL,
  createTableIfMissing: false,
  ttl: 7 * 24 * 60 * 60 * 1000, // 1 hafta
  tableName: "sessions",
});
```

#### Veritabanı Şema Yönetimi
```bash
# Şema değişikliklerini veritabanına uygulama
npm run db:push

# Migration dosyaları oluşturma
npm run db:generate

# Migration'ları çalıştırma
npm run db:migrate
```

#### Güvenlik Özellikleri
- **SQL Injection Koruması**: Drizzle ORM ile parametreli sorgular
- **Session Güvenliği**: PostgreSQL tabanlı güvenli session saklama
- **Password Hashing**: bcrypt ile güvenli şifre hash'leme
- **CORS Koruması**: Cross-origin request kontrolü
- **Type Safety**: TypeScript ile compile-time tip kontrolü

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
Authorization: Session-based

# Yeni işlem oluşturma
POST /api/transactions
Content-Type: application/json
{
  "amount": "100.00",
  "type": "expense",
  "description": "Açıklama",
  "categoryId": "uuid",
  "date": "2024-01-15"
}

# İşlem güncelleme
PUT /api/transactions/:id
Content-Type: application/json
{
  "amount": "150.00",
  "description": "Güncellenmiş açıklama"
}

# İşlem silme
DELETE /api/transactions/:id
Authorization: Session-based

# Aylık istatistikler
GET /api/transactions/monthly-stats?year=2024&month=1
Response: {
  "totalIncome": 5000.00,
  "totalExpenses": 3500.00,
  "balance": 1500.00
}
```

### Bütçe Endpoint'leri
```http
# Kullanıcı bütçeleri
GET /api/budgets
Authorization: Session-based

# Yeni bütçe oluşturma
POST /api/budgets
Content-Type: application/json
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
Authorization: Session-based

# Yeni hedef oluşturma
POST /api/goals
Content-Type: application/json
{
  "title": "Araba",
  "description": "Yeni araba alımı için tasarruf",
  "targetAmount": "50000.00",
  "targetDate": "2024-12-31",
  "icon": "fas fa-car",
  "color": "#3B82F6",
  "currentAmount": "0"
}

# Hedef güncelleme
PUT /api/goals/:id
Content-Type: application/json
{
  "title": "Güncellenmiş hedef",
  "currentAmount": "5000.00"
}

# Hedef silme
DELETE /api/goals/:id
Authorization: Session-based
```

### Kategori Endpoint'leri
```http
# Kullanıcı kategorileri
GET /api/categories
Authorization: Session-based

# Yeni kategori oluşturma
POST /api/categories
Content-Type: application/json
{
  "name": "Yeni Kategori",
  "icon": "fas fa-tag",
  "color": "#FF5722"
}

# Varsayılan kategorileri başlatma
POST /api/init/categories
Authorization: Session-based
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

## 🚀 Son Güncellemeler ve Mevcut Durum

### ✅ Tamamlanan Özellikler (v1.0)
- **PostgreSQL Entegrasyonu**: Tam veritabanı entegrasyonu ve session yönetimi
- **İşlem CRUD**: Tam işlem yönetimi (oluşturma, okuma, güncelleme, silme)
- **Finansal Hedefler CRUD**: Tam hedef yönetimi sistemi
- **Mobil Öncelikli Tasarım**: Responsive ve modern UI/UX
- **Güvenlik**: bcrypt şifreleme ve session güvenliği
- **Type Safety**: Tam TypeScript entegrasyonu
- **Real-time Updates**: TanStack Query ile otomatik veri senkronizasyonu

### 🔧 Son Teknik İyileştirmeler
- **Responsive Grid System**: Mobile-first grid yapısı
- **Enhanced Mobile Navigation**: Gelişmiş mobil navigasyon
- **Improved Typography**: Responsive tipografi sistemi
- **Better Touch Targets**: Mobil dokunma hedefleri optimizasyonu
- **Smooth Animations**: Gelişmiş animasyon sistemi
- **Database Schema Optimization**: Veritabanı şeması iyileştirmeleri

### 📊 Proje İstatistikleri
- **Frontend**: 50+ React bileşeni
- **Backend**: 15+ API endpoint'i
- **Database**: 8 ana tablo
- **Type Safety**: %100 TypeScript coverage
- **Responsive**: Mobil, tablet, masaüstü desteği
- **Security**: Enterprise-level güvenlik

## 🔮 Gelecek Özellikler

### Kısa Vadeli (v1.1)
- [ ] OCR ile fiş tarama entegrasyonu
- [ ] Sesli komut desteği
- [ ] Gelişmiş AI önerileri
- [ ] Export/Import özellikleri
- [ ] Push bildirimleri
- [ ] Offline mode desteği

### Orta Vadeli (v1.2)
- [ ] Mobil uygulama (React Native)
- [ ] Çoklu para birimi desteği
- [ ] Banka API entegrasyonları
- [ ] Gelişmiş raporlama
- [ ] Recurring transactions automation
- [ ] Budget alerts ve notifications

### Uzun Vadeli (v2.0)
- [ ] Machine Learning ile harcama tahmini
- [ ] Sosyal özellikler (aile bütçesi)
- [ ] Yatırım takibi
- [ ] Kripto para desteği
- [ ] Multi-tenant architecture
- [ ] Advanced analytics dashboard

## 📄 Lisans

Bu proje MIT Lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakınız.

## 📞 İletişim

- **Email**: [tconline26@hotmail.com]
- **GitHub**: [[https://github.com/tconline26/AkilliButce]]

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