import { Component, OnInit } from '@angular/core';

interface Expense {
  id: number;
  date: string;
  category: string;
  amount: number;
  description: string;
  status: string;
}

interface CategoryData {
  name: string;
  amount: number;
  percentage: number;
  count: number;
  color: string;
}

interface MonthlyData {
  month: string;
  amount: number;
  color: string;
}

interface Insight {
  type: 'success' | 'warning' | 'info' | 'danger';
  icon: string;
  title: string;
  description: string;
  impact: string;
}

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {
  Math = Math;

  // Analysis settings
  analysisPeriod: string = 'month';
  compareWith: string = 'none';
  viewType: string = 'overview';
  chartType: string = 'line';

  // Trend indicators
  spendingTrend: number = 12;
  avgTrend: number = -5;

  // Sample expense data (in real app, fetch from service)
  expenses: Expense[] = [
    { id: 1, date: '2024-12-01', category: 'Shopping', amount: 250, description: 'Clothing and accessories', status: 'Approved' },
    { id: 2, date: '2024-12-03', category: 'Bills', amount: 450, description: 'Electricity bill', status: 'Approved' },
    { id: 3, date: '2024-12-05', category: 'Travel', amount: 800, description: 'Flight tickets', status: 'Approved' },
    { id: 4, date: '2024-12-07', category: 'Food', amount: 120, description: 'Grocery shopping', status: 'Approved' },
    { id: 5, date: '2024-12-08', category: 'Entertainment', amount: 150, description: 'Movie tickets and dinner', status: 'Approved' },
    { id: 6, date: '2024-12-10', category: 'Shopping', amount: 300, description: 'Electronics', status: 'Approved' },
    { id: 7, date: '2024-12-12', category: 'Healthcare', amount: 200, description: 'Medical checkup', status: 'Approved' },
    { id: 8, date: '2024-12-14', category: 'Food', amount: 80, description: 'Restaurant', status: 'Approved' },
    { id: 9, date: '2024-12-15', category: 'Transportation', amount: 60, description: 'Uber rides', status: 'Approved' },
    { id: 10, date: '2024-12-17', category: 'Bills', amount: 100, description: 'Internet bill', status: 'Approved' },
    { id: 11, date: '2024-12-18', category: 'Entertainment', amount: 90, description: 'Concert tickets', status: 'Approved' },
    { id: 12, date: '2024-12-19', category: 'Food', amount: 120, description: 'Dining out', status: 'Approved' },
    { id: 13, date: '2024-12-20', category: 'Shopping', amount: 180, description: 'Home decor', status: 'Approved' },
    { id: 14, date: '2024-12-21', category: 'Travel', amount: 400, description: 'Hotel booking', status: 'Approved' },
    { id: 15, date: '2024-11-15', category: 'Shopping', amount: 200, description: 'Shoes', status: 'Approved' },
    { id: 16, date: '2024-11-18', category: 'Bills', amount: 420, description: 'Water bill', status: 'Approved' },
    { id: 17, date: '2024-11-22', category: 'Travel', amount: 600, description: 'Train tickets', status: 'Approved' },
    { id: 18, date: '2024-10-10', category: 'Food', amount: 150, description: 'Groceries', status: 'Approved' },
    { id: 19, date: '2024-10-15', category: 'Entertainment', amount: 100, description: 'Gaming subscription', status: 'Approved' },
    { id: 20, date: '2024-10-20', category: 'Shopping', amount: 350, description: 'Furniture', status: 'Approved' }
  ];

  ngOnInit() {
    this.updateAnalytics();
  }

  updateAnalytics() {
    // Recalculate all analytics based on selected period
    console.log('Updating analytics for period:', this.analysisPeriod);
  }

  refreshAnalytics() {
    this.updateAnalytics();
  }

  getTotalSpending(): number {
    return this.expenses
      .filter(e => e.status === 'Approved')
      .reduce((sum, e) => sum + e.amount, 0);
  }

  getAveragePerDay(): number {
    const total = this.getTotalSpending();
    const days = this.analysisPeriod === 'week' ? 7 : this.analysisPeriod === 'month' ? 30 : 365;
    return Math.round(total / days);
  }

  getTotalTransactions(): number {
    return this.expenses.filter(e => e.status === 'Approved').length;
  }

  getTransactionFrequency(): number {
    const total = this.getTotalTransactions();
    const weeks = this.analysisPeriod === 'week' ? 1 : this.analysisPeriod === 'month' ? 4 : 52;
    return Math.round(total / weeks);
  }

  getTopCategory(): { name: string; amount: number; percentage: number } {
    const categories = this.getCategoryBreakdown();
    if (categories.length === 0) {
      return { name: 'N/A', amount: 0, percentage: 0 };
    }
    const top = categories[0];
    return { name: top.name, amount: top.amount, percentage: top.percentage };
  }

  getCategoryBreakdown(): CategoryData[] {
    const categoryMap = new Map<string, { amount: number; count: number }>();
    const total = this.getTotalSpending();

    this.expenses
      .filter(e => e.status === 'Approved')
      .forEach(expense => {
        const current = categoryMap.get(expense.category) || { amount: 0, count: 0 };
        categoryMap.set(expense.category, {
          amount: current.amount + expense.amount,
          count: current.count + 1
        });
      });

    const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#fee140', '#30cfd0'];
    let colorIndex = 0;

    const categories: CategoryData[] = Array.from(categoryMap.entries())
      .map(([name, data]) => ({
        name,
        amount: data.amount,
        percentage: Math.round((data.amount / total) * 100),
        count: data.count,
        color: colors[colorIndex++ % colors.length]
      }))
      .sort((a, b) => b.amount - a.amount);

    return categories;
  }

  getMonthlyData(): MonthlyData[] {
    const monthMap = new Map<string, number>();
    const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a'];

    this.expenses
      .filter(e => e.status === 'Approved')
      .forEach(expense => {
        const date = new Date(expense.date);
        const monthKey = date.toLocaleString('default', { month: 'short' });
        monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + expense.amount);
      });

    let colorIndex = 0;
    return Array.from(monthMap.entries())
      .map(([month, amount]) => ({
        month,
        amount,
        color: colors[colorIndex++ % colors.length]
      }));
  }

  getTopExpenses(): Expense[] {
    return this.expenses
      .filter(e => e.status === 'Approved')
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }

  getDayOfWeekAnalysis(): { name: string; amount: number; percentage: number }[] {
    const dayMap = new Map<string, number>();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    this.expenses
      .filter(e => e.status === 'Approved')
      .forEach(expense => {
        const date = new Date(expense.date);
        const dayName = days[date.getDay()];
        dayMap.set(dayName, (dayMap.get(dayName) || 0) + expense.amount);
      });

    const total = this.getTotalSpending();
    const result = days.map(day => ({
      name: day,
      amount: dayMap.get(day) || 0,
      percentage: Math.round(((dayMap.get(day) || 0) / total) * 100)
    }));

    return result.filter(d => d.amount > 0);
  }

  getTimeOfDayAnalysis(): { period: string; amount: number; percentage: number }[] {
    // Simulated time-of-day data (in real app, expenses would have timestamps)
    const total = this.getTotalSpending();
    return [
      { period: 'Morning (6AM-12PM)', amount: Math.round(total * 0.25), percentage: 25 },
      { period: 'Afternoon (12PM-6PM)', amount: Math.round(total * 0.40), percentage: 40 },
      { period: 'Evening (6PM-12AM)', amount: Math.round(total * 0.30), percentage: 30 },
      { period: 'Night (12AM-6AM)', amount: Math.round(total * 0.05), percentage: 5 }
    ].filter(t => t.amount > 0);
  }

  getBudgetPerformance(): { category: string; percentage: number; status: 'under' | 'near' | 'over' }[] {
    const categories = this.getCategoryBreakdown();
    const budgets: { [key: string]: number } = {
      'Shopping': 500,
      'Bills': 600,
      'Travel': 1000,
      'Food': 400,
      'Entertainment': 200,
      'Healthcare': 300,
      'Transportation': 300
    };

    return categories.map(cat => {
      const budget = budgets[cat.name] || 500;
      const percentage = Math.round((cat.amount / budget) * 100);
      let status: 'under' | 'near' | 'over' = 'under';
      if (percentage >= 100) status = 'over';
      else if (percentage >= 80) status = 'near';

      return {
        category: cat.name,
        percentage,
        status
      };
    });
  }

  getInsights(): Insight[] {
    const insights: Insight[] = [];
    const total = this.getTotalSpending();
    const categories = this.getCategoryBreakdown();

    // High spending insight
    if (total > 3000) {
      insights.push({
        type: 'warning',
        icon: '⚠️',
        title: 'High Spending Alert',
        description: `Your spending this period ($${total}) is higher than usual. Consider reviewing your expenses.`,
        impact: 'High Impact'
      });
    }

    // Top category insight
    if (categories.length > 0 && categories[0].percentage > 40) {
      insights.push({
        type: 'info',
        icon: '📊',
        title: 'Category Concentration',
        description: `${categories[0].percentage}% of your spending is in ${categories[0].name}. Consider diversifying your budget allocation.`,
        impact: 'Medium Impact'
      });
    }

    // Savings opportunity
    insights.push({
      type: 'success',
      icon: '💰',
      title: 'Savings Opportunity',
      description: 'You could save up to $200/month by reducing entertainment and dining expenses by 20%.',
      impact: 'High Impact'
    });

    // Budget compliance
    const budgetPerf = this.getBudgetPerformance();
    const overBudget = budgetPerf.filter(b => b.status === 'over').length;
    if (overBudget > 0) {
      insights.push({
        type: 'danger',
        icon: '🚨',
        title: 'Budget Exceeded',
        description: `${overBudget} categories have exceeded their budget limits. Review and adjust spending.`,
        impact: 'Critical'
      });
    } else {
      insights.push({
        type: 'success',
        icon: '✅',
        title: 'On Track',
        description: 'All categories are within budget limits. Great job managing your expenses!',
        impact: 'Positive'
      });
    }

    // Spending trend
    if (this.spendingTrend > 10) {
      insights.push({
        type: 'warning',
        icon: '📈',
        title: 'Increasing Trend',
        description: `Spending has increased by ${this.spendingTrend}% compared to previous period. Monitor closely.`,
        impact: 'Medium Impact'
      });
    }

    return insights;
  }

  getComparisonData(): { category: string; current: number; previous: number; change: number; changePercent: number }[] {
    const currentCategories = this.getCategoryBreakdown();
    
    // Simulated previous period data (in real app, fetch from backend)
    const previousData: { [key: string]: number } = {
      'Shopping': 400,
      'Bills': 500,
      'Travel': 900,
      'Food': 280,
      'Entertainment': 180,
      'Healthcare': 150,
      'Transportation': 200
    };

    return currentCategories.map(cat => {
      const previous = previousData[cat.name] || 0;
      const change = cat.amount - previous;
      const changePercent = previous > 0 ? Math.round((change / previous) * 100) : 0;

      return {
        category: cat.name,
        current: cat.amount,
        previous,
        change,
        changePercent
      };
    });
  }
}
