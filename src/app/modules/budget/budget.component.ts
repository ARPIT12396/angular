import { Component, OnInit } from '@angular/core';

interface Budget {
  id: number;
  category: string;
  amount: number;
  spent: number;
  remaining: number;
  percentage: number;
  period: string;
  month: number;
  year: number;
  alertThreshold: number;
  notes: string;
  status: 'On Track' | 'Warning' | 'Over Budget';
}

interface Alert {
  id: number;
  budgetId: number;
  message: string;
  type: 'warning' | 'danger';
  timestamp: Date;
}

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent implements OnInit {
  Math = Math;

  budgets: Budget[] = [];
  alerts: Alert[] = [];
  
  // Form data
  showBudgetForm = false;
  editingBudgetId: number | null = null;
  currentBudget: any = {
    category: '',
    amount: 0,
    alertThreshold: 80,
    notes: ''
  };

  // Period selection
  selectedPeriod: 'monthly' | 'quarterly' | 'yearly' = 'monthly';
  selectedMonth: number = new Date().getMonth();
  selectedYear: number = new Date().getFullYear();
  
  months = ['January', 'February', 'March', 'April', 'May', 'June', 
            'July', 'August', 'September', 'October', 'November', 'December'];
  years: number[] = [];

  // Sample expenses for calculation (in real app, this would come from expense service)
  expenses = [
    { date: '2024-01-15', category: 'Shopping', amount: 250, status: 'Approved' },
    { date: '2024-01-18', category: 'Bills', amount: 450, status: 'Approved' },
    { date: '2024-01-20', category: 'Travel', amount: 800, status: 'Approved' },
    { date: '2024-01-22', category: 'Food', amount: 320, status: 'Approved' },
    { date: '2024-01-25', category: 'Entertainment', amount: 150, status: 'Approved' }
  ];

  ngOnInit() {
    // Generate years
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 2; i <= currentYear + 2; i++) {
      this.years.push(i);
    }

    // Load initial data
    this.loadSampleBudgets();
    this.loadBudgetData();
  }

  loadSampleBudgets() {
    // Sample budgets (in real app, this would be loaded from backend)
    this.budgets = [
      {
        id: 1,
        category: 'Shopping',
        amount: 500,
        spent: 250,
        remaining: 250,
        percentage: 50,
        period: 'monthly',
        month: 0,
        year: 2024,
        alertThreshold: 80,
        notes: 'Monthly shopping budget',
        status: 'On Track'
      },
      {
        id: 2,
        category: 'Bills',
        amount: 600,
        spent: 450,
        remaining: 150,
        percentage: 75,
        period: 'monthly',
        month: 0,
        year: 2024,
        alertThreshold: 80,
        notes: 'Utilities and rent',
        status: 'On Track'
      },
      {
        id: 3,
        category: 'Travel',
        amount: 1000,
        spent: 800,
        remaining: 200,
        percentage: 80,
        period: 'monthly',
        month: 0,
        year: 2024,
        alertThreshold: 80,
        notes: 'Travel and transportation',
        status: 'Warning'
      },
      {
        id: 4,
        category: 'Food',
        amount: 400,
        spent: 320,
        remaining: 80,
        percentage: 80,
        period: 'monthly',
        month: 0,
        year: 2024,
        alertThreshold: 75,
        notes: 'Groceries and dining',
        status: 'Warning'
      },
      {
        id: 5,
        category: 'Entertainment',
        amount: 200,
        spent: 150,
        remaining: 50,
        percentage: 75,
        period: 'monthly',
        month: 0,
        year: 2024,
        alertThreshold: 80,
        notes: 'Movies, games, subscriptions',
        status: 'On Track'
      }
    ];
  }

  loadBudgetData() {
    // Recalculate all budget data based on selected period
    this.budgets.forEach(budget => {
      this.updateBudgetCalculations(budget);
    });
    this.checkAlerts();
  }

  updateBudgetCalculations(budget: Budget) {
    // In real app, fetch actual expenses from expense service
    // For now, calculate based on sample data
    const categoryExpenses = this.expenses.filter(exp => 
      exp.category === budget.category && exp.status === 'Approved'
    );
    
    budget.spent = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    budget.remaining = Math.max(0, budget.amount - budget.spent);
    budget.percentage = budget.amount > 0 ? Math.round((budget.spent / budget.amount) * 100) : 0;
    
    // Update status
    if (budget.percentage >= 100) {
      budget.status = 'Over Budget';
    } else if (budget.percentage >= budget.alertThreshold) {
      budget.status = 'Warning';
    } else {
      budget.status = 'On Track';
    }
  }

  saveBudget() {
    if (!this.currentBudget.category || !this.currentBudget.amount) {
      alert('Please fill in all required fields');
      return;
    }

    if (this.editingBudgetId !== null) {
      // Update existing budget
      const index = this.budgets.findIndex(b => b.id === this.editingBudgetId);
      if (index !== -1) {
        this.budgets[index] = {
          ...this.budgets[index],
          category: this.currentBudget.category,
          amount: this.currentBudget.amount,
          alertThreshold: this.currentBudget.alertThreshold,
          notes: this.currentBudget.notes
        };
        this.updateBudgetCalculations(this.budgets[index]);
      }
    } else {
      // Add new budget
      const newBudget: Budget = {
        id: this.budgets.length > 0 ? Math.max(...this.budgets.map(b => b.id)) + 1 : 1,
        category: this.currentBudget.category,
        amount: this.currentBudget.amount,
        spent: 0,
        remaining: this.currentBudget.amount,
        percentage: 0,
        period: this.selectedPeriod,
        month: this.selectedMonth,
        year: this.selectedYear,
        alertThreshold: this.currentBudget.alertThreshold || 80,
        notes: this.currentBudget.notes || '',
        status: 'On Track'
      };
      this.updateBudgetCalculations(newBudget);
      this.budgets.push(newBudget);
    }

    this.cancelBudgetForm();
    this.checkAlerts();
  }

  editBudget(id: number) {
    const budget = this.budgets.find(b => b.id === id);
    if (budget) {
      this.currentBudget = {
        category: budget.category,
        amount: budget.amount,
        alertThreshold: budget.alertThreshold,
        notes: budget.notes
      };
      this.editingBudgetId = id;
      this.showBudgetForm = true;
    }
  }

  deleteBudget(id: number) {
    if (confirm('Are you sure you want to delete this budget?')) {
      this.budgets = this.budgets.filter(b => b.id !== id);
      this.alerts = this.alerts.filter(a => a.budgetId !== id);
    }
  }

  cancelBudgetForm() {
    this.currentBudget = {
      category: '',
      amount: 0,
      alertThreshold: 80,
      notes: ''
    };
    this.editingBudgetId = null;
    this.showBudgetForm = false;
  }

  getTotalBudget(): number {
    return this.budgets.reduce((sum, b) => sum + b.amount, 0);
  }

  getTotalSpent(): number {
    return this.budgets.reduce((sum, b) => sum + b.spent, 0);
  }

  getRemaining(): number {
    return Math.max(0, this.getTotalBudget() - this.getTotalSpent());
  }

  getSpentPercentage(): number {
    const total = this.getTotalBudget();
    return total > 0 ? Math.round((this.getTotalSpent() / total) * 100) : 0;
  }

  getRemainingPercentage(): number {
    return Math.max(0, 100 - this.getSpentPercentage());
  }

  checkAlerts() {
    this.alerts = [];
    this.budgets.forEach(budget => {
      if (budget.percentage >= budget.alertThreshold) {
        this.alerts.push({
          id: this.alerts.length + 1,
          budgetId: budget.id,
          message: `${budget.category} budget is at ${budget.percentage}% (${budget.alertThreshold}% threshold). Spent: $${budget.spent} of $${budget.amount}`,
          type: budget.percentage >= 100 ? 'danger' : 'warning',
          timestamp: new Date()
        });
      }
    });
  }

  getAlerts(): Alert[] {
    return this.alerts;
  }

  dismissAlert(id: number) {
    this.alerts = this.alerts.filter(a => a.id !== id);
  }

  sortBudgets(sortBy: 'category' | 'spent') {
    if (sortBy === 'category') {
      this.budgets.sort((a, b) => a.category.localeCompare(b.category));
    } else if (sortBy === 'spent') {
      this.budgets.sort((a, b) => b.percentage - a.percentage);
    }
  }

  applyTemplate(template: 'conservative' | 'balanced' | 'flexible') {
    if (!confirm('This will replace your current budgets. Continue?')) {
      return;
    }

    this.budgets = [];

    const templates = {
      conservative: [
        { category: 'Shopping', amount: 300 },
        { category: 'Bills', amount: 500 },
        { category: 'Travel', amount: 400 },
        { category: 'Food', amount: 300 },
        { category: 'Entertainment', amount: 100 },
        { category: 'Healthcare', amount: 200 },
        { category: 'Transportation', amount: 200 }
      ],
      balanced: [
        { category: 'Shopping', amount: 500 },
        { category: 'Bills', amount: 600 },
        { category: 'Travel', amount: 800 },
        { category: 'Food', amount: 400 },
        { category: 'Entertainment', amount: 200 },
        { category: 'Healthcare', amount: 300 },
        { category: 'Transportation', amount: 300 }
      ],
      flexible: [
        { category: 'Shopping', amount: 800 },
        { category: 'Bills', amount: 700 },
        { category: 'Travel', amount: 1200 },
        { category: 'Food', amount: 600 },
        { category: 'Entertainment', amount: 400 },
        { category: 'Healthcare', amount: 400 },
        { category: 'Transportation', amount: 500 }
      ]
    };

    const selectedTemplate = templates[template];
    let id = 1;

    selectedTemplate.forEach(item => {
      const newBudget: Budget = {
        id: id++,
        category: item.category,
        amount: item.amount,
        spent: 0,
        remaining: item.amount,
        percentage: 0,
        period: this.selectedPeriod,
        month: this.selectedMonth,
        year: this.selectedYear,
        alertThreshold: 80,
        notes: `${template.charAt(0).toUpperCase() + template.slice(1)} budget template`,
        status: 'On Track'
      };
      this.updateBudgetCalculations(newBudget);
      this.budgets.push(newBudget);
    });

    this.checkAlerts();
  }
}
