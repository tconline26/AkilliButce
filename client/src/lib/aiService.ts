export class AIService {
  static calculateFinancialHealthScore(
    totalIncome: number,
    totalExpenses: number,
    savingsRate: number,
    budgetAdherence: number,
    goalProgress: number
  ): { score: number; factors: any } {
    // Calculate individual factor scores
    const savingsScore = Math.min(100, (savingsRate / 20) * 100); // 20% savings = 100 points
    const budgetScore = budgetAdherence * 100; // Already a percentage
    const expenseRatio = totalExpenses / totalIncome;
    const disciplineScore = Math.max(0, (1 - expenseRatio) * 100);
    const goalsScore = goalProgress * 100;

    // Weighted average
    const overallScore = Math.round(
      (savingsScore * 0.3 + budgetScore * 0.25 + disciplineScore * 0.25 + goalsScore * 0.2)
    );

    return {
      score: Math.min(100, Math.max(0, overallScore)),
      factors: {
        savings: {
          score: Math.round(savingsScore),
          label: this.getScoreLabel(savingsScore)
        },
        budget: {
          score: Math.round(budgetScore),
          label: this.getScoreLabel(budgetScore)
        },
        goals: {
          score: Math.round(goalsScore),
          label: this.getScoreLabel(goalsScore)
        },
        discipline: {
          score: Math.round(disciplineScore),
          label: this.getScoreLabel(disciplineScore)
        }
      }
    };
  }

  static getScoreLabel(score: number): string {
    if (score >= 90) return 'Mükemmel';
    if (score >= 70) return 'İyi';
    if (score >= 50) return 'Orta';
    if (score >= 30) return 'Zayıf';
    return 'Kritik';
  }

  static generateInsights(
    transactions: any[],
    budgets: any[],
    monthlyStats: any,
    previousMonthStats?: any
  ): any[] {
    const insights = [];

    // Budget warnings
    budgets.forEach(budget => {
      const spentPercentage = (budget.spent || 0) / parseFloat(budget.amount);
      
      if (spentPercentage > 0.8) {
        insights.push({
          type: 'budget_warning',
          title: 'Bütçe Uyarısı',
          content: `${budget.category?.name} kategorisinde bütçenizin %${Math.round(spentPercentage * 100)}'ini kullandınız. Dikkatli harcayın.`,
          priority: spentPercentage > 0.9 ? 3 : 2,
          color: spentPercentage > 0.9 ? '#F44336' : '#FF9800'
        });
      }
    });

    // Savings opportunities
    const restaurantSpending = transactions
      .filter(t => t.type === 'expense' && t.description.toLowerCase().includes('restaurant'))
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    if (restaurantSpending > 500) {
      insights.push({
        type: 'saving_tip',
        title: 'Tasarruf Önerisi',
        content: `Hafta sonu ev yemekleri yaparak aylık ₺${Math.round(restaurantSpending * 0.4)} tasarruf edebilirsiniz. Restoran harcamalarınız ortalamanın üzerinde.`,
        priority: 1,
        color: '#4CAF50'
      });
    }

    // Trend analysis
    if (previousMonthStats) {
      const expenseChange = ((monthlyStats.totalExpenses - previousMonthStats.totalExpenses) / previousMonthStats.totalExpenses) * 100;
      
      if (Math.abs(expenseChange) > 10) {
        insights.push({
          type: 'trend_analysis',
          title: 'Trend Analizi',
          content: `Bu ay harcamalarınız geçen aya göre %${Math.round(Math.abs(expenseChange))} ${expenseChange > 0 ? 'arttı' : 'azaldı'}. ${expenseChange < 0 ? 'Bu tempo devam ederse yıllık önemli tasarruf edeceksiniz.' : 'Harcama artışının nedenlerini gözden geçirmenizi öneririm.'}`,
          priority: 1,
          color: '#2196F3'
        });
      }
    }

    // Emergency fund recommendation
    const monthlyExpenses = monthlyStats.totalExpenses;
    const emergencyFundTarget = monthlyExpenses * 3;
    
    insights.push({
      type: 'goal_suggestion',
      title: 'Hedef Önerisi',
      content: `Acil durum fonu oluşturmayı düşünün. Aylık giderinizin 3 katı (₺${emergencyFundTarget.toLocaleString('tr-TR')}) ideal olacaktır.`,
      priority: 1,
      color: '#9C27B0'
    });

    return insights;
  }

  static categorizeExpenseDescription(description: string): string | null {
    const desc = description.toLowerCase();
    
    const categoryKeywords = {
      'Gıda & İçecek': ['market', 'süpermarket', 'bakkal', 'restaurant', 'cafe', 'yemek', 'kahve', 'çay'],
      'Ulaşım': ['benzin', 'yakıt', 'otobüs', 'metro', 'taksi', 'uber', 'bilet', 'park'],
      'Eğlence': ['sinema', 'film', 'oyun', 'konsert', 'tiyatro', 'bar', 'eğlence'],
      'Faturalar': ['elektrik', 'su', 'doğalgaz', 'internet', 'telefon', 'fatura'],
      'Alışveriş': ['mağaza', 'alışveriş', 'kıyafet', 'ayakkabı', 'elektronik'],
      'Sağlık': ['eczane', 'doktor', 'hastane', 'ilaç', 'muayene'],
      'Ev': ['kira', 'mortgage', 'tadilat', 'mobilya', 'ev'],
    };

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => desc.includes(keyword))) {
        return category;
      }
    }

    return null;
  }

  static formatCurrency(amount: number): string {
    return `₺${amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  static formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Bugün';
    if (days === 1) return 'Dün';
    if (days < 7) return `${days} gün önce`;
    if (days < 30) return `${Math.floor(days / 7)} hafta önce`;
    
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }

  static calculateBudgetProgress(spent: number, budget: number): {
    percentage: number;
    remaining: number;
    status: 'safe' | 'warning' | 'danger';
  } {
    const percentage = (spent / budget) * 100;
    const remaining = budget - spent;
    
    let status: 'safe' | 'warning' | 'danger' = 'safe';
    if (percentage > 90) status = 'danger';
    else if (percentage > 75) status = 'warning';

    return {
      percentage: Math.min(100, percentage),
      remaining: Math.max(0, remaining),
      status
    };
  }
}
