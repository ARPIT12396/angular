import { Component } from '@angular/core';

interface Expense {
  date: string;
  category: string;
  amount: number | null;
  description: string;
  status?: string;
}

interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  expense: Expense = {
    date: '',
    category: '',
    amount: null,
    description: ''
  };

  pendingApprovals: Expense[] = [];
  approvedExpenses: Expense[] = [];
  monthlyBudget: number = 5000; // Default monthly budget

  // Month selector properties
  selectedMonth: number = new Date().getMonth();
  selectedYear: number = new Date().getFullYear();
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  availableYears: number[] = [2023, 2024, 2025, 2026];

  addExpense() {
    if (this.expense.date && this.expense.category && this.expense.amount) {
      // Add to pending approvals instead of directly to expenses
      this.pendingApprovals.push({ ...this.expense });
      // Reset form
      this.expense = {
        date: '',
        category: '',
        amount: null,
        description: ''
      };
      console.log('Expense added to pending approvals');
    } else {
      alert('Please fill in Date, Category, and Amount fields.');
    }
  }

  approveExpense(index: number) {
    const expense = this.pendingApprovals[index];
    this.approvedExpenses.push(expense);
    this.pendingApprovals.splice(index, 1);
    console.log('Expense approved:', expense);
  }

  rejectExpense(index: number) {
    const expense = this.pendingApprovals[index];
    this.pendingApprovals.splice(index, 1);
    console.log('Expense rejected:', expense);
  }

  getTotalExpenses(): number {
    const approved = this.approvedExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
    const pending = this.pendingApprovals.reduce((sum, exp) => sum + (exp.amount || 0), 0);
    return approved + pending;
  }

  getMonthlyExpenses(): number {
    const allExpenses = [...this.approvedExpenses, ...this.pendingApprovals];
    
    return allExpenses.reduce((sum, exp) => {
      const expenseDate = new Date(exp.date);
      if (expenseDate.getMonth() === this.selectedMonth && expenseDate.getFullYear() === this.selectedYear) {
        return sum + (exp.amount || 0);
      }
      return sum;
    }, 0);
  }

  getSelectedMonthName(): string {
    return this.months[this.selectedMonth] + ' ' + this.selectedYear;
  }

  getExpenseCountForMonth(): number {
    const allExpenses = [...this.approvedExpenses, ...this.pendingApprovals];
    return allExpenses.filter(exp => {
      const expenseDate = new Date(exp.date);
      return expenseDate.getMonth() === this.selectedMonth && expenseDate.getFullYear() === this.selectedYear;
    }).length;
  }

  onMonthChange(): void {
    // Trigger UI update when month/year changes
  }

  goToCurrentMonth(): void {
    this.selectedMonth = new Date().getMonth();
    this.selectedYear = new Date().getFullYear();
  }

  getExpenseCountByMonth(month: number, year: number): number {
    const allExpenses = [...this.approvedExpenses, ...this.pendingApprovals];
    return allExpenses.filter(exp => {
      const expenseDate = new Date(exp.date);
      return expenseDate.getMonth() === month && expenseDate.getFullYear() === year;
    }).length;
  }

  getMonthsWithExpenses(): Array<{month: number, year: number, count: number}> {
    const allExpenses = [...this.approvedExpenses, ...this.pendingApprovals];
    const monthMap = new Map<string, number>();
    
    allExpenses.forEach(exp => {
      const expenseDate = new Date(exp.date);
      const key = `${expenseDate.getFullYear()}-${expenseDate.getMonth()}`;
      monthMap.set(key, (monthMap.get(key) || 0) + 1);
    });

    const result: Array<{month: number, year: number, count: number}> = [];
    monthMap.forEach((count, key) => {
      const [year, month] = key.split('-').map(Number);
      result.push({ month, year, count });
    });

    // Sort by year and month, most recent first
    return result.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
  }

  getMonthShortName(monthIndex: number): string {
    const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return shortMonths[monthIndex];
  }

  jumpToMonth(month: number, year: number): void {
    this.selectedMonth = month;
    this.selectedYear = year;
  }

  getFilteredPendingApprovals(): any[] {
    return this.pendingApprovals
      .map((exp, index) => ({...exp, originalIndex: index}))
      .filter(exp => {
        const expenseDate = new Date(exp.date);
        return expenseDate.getMonth() === this.selectedMonth && expenseDate.getFullYear() === this.selectedYear;
      });
  }

  getFilteredApprovedExpenses(): Expense[] {
    return this.approvedExpenses.filter(exp => {
      const expenseDate = new Date(exp.date);
      return expenseDate.getMonth() === this.selectedMonth && expenseDate.getFullYear() === this.selectedYear;
    });
  }

  getMonthlyPendingTotal(): number {
    return this.getFilteredPendingApprovals().reduce((sum, exp) => sum + (exp.amount || 0), 0);
  }

  getMonthlyApprovedTotal(): number {
    return this.getFilteredApprovedExpenses().reduce((sum, exp) => sum + (exp.amount || 0), 0);
  }

  getCurrentMonthName(): string {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    return months[new Date().getMonth()];
  }

  getPendingTotal(): number {
    return this.pendingApprovals.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  }

  getApprovedTotal(): number {
    return this.approvedExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  }

  getBudgetPercentage(): number {
    const monthlyTotal = this.getMonthlyExpenses();
    return Math.min(Math.round((monthlyTotal / this.monthlyBudget) * 100), 100);
  }

  getCategoryBreakdown(): CategoryBreakdown[] {
    const categoryMap = new Map<string, number>();
    const allExpenses = [...this.approvedExpenses, ...this.pendingApprovals];
    
    // Filter by selected month
    const filteredExpenses = allExpenses.filter(exp => {
      const expenseDate = new Date(exp.date);
      return expenseDate.getMonth() === this.selectedMonth && expenseDate.getFullYear() === this.selectedYear;
    });
    
    filteredExpenses.forEach(exp => {
      const current = categoryMap.get(exp.category) || 0;
      categoryMap.set(exp.category, current + (exp.amount || 0));
    });

    const total = this.getMonthlyExpenses();
    const breakdown: CategoryBreakdown[] = [];
    
    categoryMap.forEach((amount, category) => {
      breakdown.push({
        category,
        amount,
        percentage: total > 0 ? Math.round((amount / total) * 100) : 0
      });
    });

    return breakdown.sort((a, b) => b.amount - a.amount);
  }

  getRecentActivity(): Expense[] {
    const pending = this.getFilteredPendingApprovals().map(exp => ({...exp, status: 'Pending'}));
    const approved = this.getFilteredApprovedExpenses().map(exp => ({...exp, status: 'Approved'}));
    return [...pending, ...approved].slice(-5).reverse();
  }

  getProgressBarClass(category: string): string {
    const classes: {[key: string]: string} = {
      'Shopping': 'bg-primary',
      'Bills': 'bg-danger',
      'Travel': 'bg-info',
      'Food': 'bg-success',
      'Entertainment': 'bg-warning',
      'Healthcare': 'bg-secondary',
      'Other': 'bg-dark'
    };
    return classes[category] || 'bg-primary';
  }

  getStatusBadgeClass(status: string | undefined): string {
    return status === 'Approved' ? 'bg-success' : 'bg-warning';
  }
}
