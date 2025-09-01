export interface TransactionWithCategory {
  id: string;
  userId: string;
  amount: string;
  type: 'income' | 'expense';
  description: string;
  categoryId: string | null;
  date: Date;
  source: 'manual' | 'ocr' | 'voice' | 'ai';
  isRecurring: boolean;
  recurringPeriod: string | null;
  createdAt: Date;
  updatedAt: Date;
  category?: {
    id: string;
    name: string;
    icon: string;
    color: string;
    isDefault: boolean;
    userId: string | null;
    createdAt: Date;
  } | null;
}

export interface BudgetWithCategory {
  id: string;
  userId: string;
  categoryId: string | null;
  amount: string;
  period: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  spent?: number;
  category?: {
    id: string;
    name: string;
    icon: string;
    color: string;
    isDefault: boolean;
    userId: string | null;
    createdAt: Date;
  } | null;
}

export interface MonthlyStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export interface FinancialHealthScore {
  score: number;
  factors: {
    savings: { score: number; label: string };
    budget: { score: number; label: string };
    goals: { score: number; label: string };
    discipline: { score: number; label: string };
  };
}

export interface ChartData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

export interface TrendData {
  month: string;
  income: number;
  expenses: number;
}

export interface QuickActionType {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  action: () => void;
}

export interface AIInsight {
  id: string;
  userId: string;
  type: 'saving_tip' | 'budget_warning' | 'trend_analysis' | 'goal_suggestion';
  title: string;
  content: string;
  priority: number;
  isRead: boolean;
  validUntil: Date | null;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  response?: string;
  isFromUser: boolean;
  createdAt: Date;
}
