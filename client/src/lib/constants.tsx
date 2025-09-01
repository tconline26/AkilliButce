export const CATEGORIES = {
  FOOD: { name: "Gıda & İçecek", icon: "fas fa-utensils", color: "#4CAF50" },
  TRANSPORT: { name: "Ulaşım", icon: "fas fa-car", color: "#FF9800" },
  ENTERTAINMENT: { name: "Eğlence", icon: "fas fa-gamepad", color: "#F44336" },
  BILLS: { name: "Faturalar", icon: "fas fa-file-invoice", color: "#2196F3" },
  SHOPPING: { name: "Alışveriş", icon: "fas fa-shopping-bag", color: "#9C27B0" },
  HEALTH: { name: "Sağlık", icon: "fas fa-heart", color: "#E91E63" },
  EDUCATION: { name: "Eğitim", icon: "fas fa-graduation-cap", color: "#00BCD4" },
  HOME: { name: "Ev", icon: "fas fa-home", color: "#795548" },
  INCOME: { name: "Gelir", icon: "fas fa-wallet", color: "#4CAF50" },
  OTHER: { name: "Diğer", icon: "fas fa-ellipsis-h", color: "#9E9E9E" },
} as const;

export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
} as const;

export const BUDGET_PERIODS = {
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
} as const;

export const TRANSACTION_SOURCES = {
  MANUAL: 'manual',
  OCR: 'ocr',
  VOICE: 'voice',
  AI: 'ai',
} as const;

export const CURRENCY = '₺';

export const FINANCIAL_HEALTH_RANGES = {
  EXCELLENT: { min: 90, max: 100, label: 'Mükemmel', color: '#4CAF50' },
  GOOD: { min: 70, max: 89, label: 'İyi', color: '#8BC34A' },
  FAIR: { min: 50, max: 69, label: 'Orta', color: '#FF9800' },
  POOR: { min: 30, max: 49, label: 'Zayıf', color: '#FF5722' },
  CRITICAL: { min: 0, max: 29, label: 'Kritik', color: '#F44336' },
} as const;

export const TURKISH_MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

export const TURKISH_DAYS = [
  'Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'
];

export const QUICK_CHAT_QUESTIONS = [
  "Bu ay tasarruf durumum nasıl?",
  "Gelecek ay bütçem nasıl olmalı?",
  "En çok neye para harcıyorum?",
  "Finansal hedeflerime ne kadar yakınım?",
  "Tasarruf önerileriniz neler?",
];
