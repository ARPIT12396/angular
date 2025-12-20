import { Component, OnInit } from '@angular/core';

interface ReportData {
  totalExpenses: number;
  expenseCount: number;
  averagePerDay: number;
  highestCategory: string;
  highestCategoryAmount: number;
  totalTrips: number;
  tripsExpense: number;
  approvedTotal: number;
  pendingTotal: number;
  expenses: any[];
  categoryBreakdown: any[];
  monthlyData: any[];
  trips: any[];
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  selectedReportType: string = 'expense';
  startDate: string = '';
  endDate: string = '';
  reportGenerated: boolean = false;
  Math = Math; // Expose Math to template

  reportData: ReportData = {
    totalExpenses: 0,
    expenseCount: 0,
    averagePerDay: 0,
    highestCategory: 'N/A',
    highestCategoryAmount: 0,
    totalTrips: 0,
    tripsExpense: 0,
    approvedTotal: 0,
    pendingTotal: 0,
    expenses: [],
    categoryBreakdown: [],
    monthlyData: [],
    trips: []
  };

  // Sample data (in real app, this would come from a service)
  private sampleExpenses = [
    { date: '2025-12-01', category: 'Shopping', amount: 150, description: 'Groceries', status: 'Approved' },
    { date: '2025-12-05', category: 'Bills', amount: 200, description: 'Electricity bill', status: 'Approved' },
    { date: '2025-12-10', category: 'Travel', amount: 500, description: 'Flight tickets', status: 'Approved' },
    { date: '2025-12-15', category: 'Food', amount: 75, description: 'Restaurant', status: 'Pending' },
    { date: '2025-11-20', category: 'Healthcare', amount: 300, description: 'Medical checkup', status: 'Approved' },
    { date: '2025-11-25', category: 'Shopping', amount: 120, description: 'Clothing', status: 'Approved' },
  ];

  private sampleTrips = [
    { 
      name: 'Business Trip NYC', 
      destination: 'New York', 
      startDate: '2025-12-01', 
      endDate: '2025-12-05', 
      budget: 2000, 
      spent: 1800, 
      status: 'Completed',
      budgetPercentage: 90
    },
    { 
      name: 'Conference Seattle', 
      destination: 'Seattle', 
      startDate: '2025-11-15', 
      endDate: '2025-11-18', 
      budget: 1500, 
      spent: 1200, 
      status: 'Completed',
      budgetPercentage: 80
    }
  ];

  ngOnInit(): void {
    this.setQuickDate('month');
  }

  setQuickDate(period: string): void {
    const today = new Date();
    this.endDate = today.toISOString().split('T')[0];

    switch (period) {
      case 'today':
        this.startDate = this.endDate;
        break;
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        this.startDate = weekAgo.toISOString().split('T')[0];
        break;
      case 'month':
        const monthAgo = new Date(today);
        monthAgo.setMonth(today.getMonth() - 1);
        this.startDate = monthAgo.toISOString().split('T')[0];
        break;
      case 'quarter':
        const quarterAgo = new Date(today);
        quarterAgo.setMonth(today.getMonth() - 3);
        this.startDate = quarterAgo.toISOString().split('T')[0];
        break;
      case 'year':
        const yearAgo = new Date(today);
        yearAgo.setFullYear(today.getFullYear() - 1);
        this.startDate = yearAgo.toISOString().split('T')[0];
        break;
    }

    this.generateReport();
  }

  generateReport(): void {
    if (!this.startDate || !this.endDate) {
      return;
    }

    // Filter expenses by date range
    const filteredExpenses = this.sampleExpenses.filter(exp => {
      const expDate = new Date(exp.date);
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      return expDate >= start && expDate <= end;
    });

    const filteredTrips = this.sampleTrips.filter(trip => {
      const tripDate = new Date(trip.startDate);
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      return tripDate >= start && tripDate <= end;
    });

    // Calculate totals
    const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const approvedTotal = filteredExpenses.filter(e => e.status === 'Approved').reduce((sum, exp) => sum + exp.amount, 0);
    const pendingTotal = filteredExpenses.filter(e => e.status === 'Pending').reduce((sum, exp) => sum + exp.amount, 0);
    
    // Calculate days between dates
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;
    const averagePerDay = days > 0 ? Math.round(totalExpenses / days) : 0;

    // Category breakdown
    const categoryMap = new Map<string, { amount: number, count: number }>();
    filteredExpenses.forEach(exp => {
      const current = categoryMap.get(exp.category) || { amount: 0, count: 0 };
      categoryMap.set(exp.category, {
        amount: current.amount + exp.amount,
        count: current.count + 1
      });
    });

    const categoryBreakdown: any[] = [];
    categoryMap.forEach((data, category) => {
      categoryBreakdown.push({
        category,
        amount: data.amount,
        count: data.count,
        percentage: totalExpenses > 0 ? Math.round((data.amount / totalExpenses) * 100) : 0
      });
    });
    categoryBreakdown.sort((a, b) => b.amount - a.amount);

    // Find highest category
    let highestCategory = 'N/A';
    let highestCategoryAmount = 0;
    if (categoryBreakdown.length > 0) {
      highestCategory = categoryBreakdown[0].category;
      highestCategoryAmount = categoryBreakdown[0].amount;
    }

    // Monthly data
    const monthlyMap = new Map<string, { total: number, count: number }>();
    filteredExpenses.forEach(exp => {
      const date = new Date(exp.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const current = monthlyMap.get(monthKey) || { total: 0, count: 0 };
      monthlyMap.set(monthKey, {
        total: current.total + exp.amount,
        count: current.count + 1
      });
    });

    const monthlyData: any[] = [];
    monthlyMap.forEach((data, monthKey) => {
      const [year, month] = monthKey.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      monthlyData.push({
        month: `${monthNames[parseInt(month) - 1]} ${year}`,
        total: data.total,
        count: data.count,
        average: Math.round(data.total / data.count)
      });
    });
    monthlyData.sort((a, b) => a.month.localeCompare(b.month));

    // Update report data
    this.reportData = {
      totalExpenses,
      expenseCount: filteredExpenses.length,
      averagePerDay,
      highestCategory,
      highestCategoryAmount,
      totalTrips: filteredTrips.length,
      tripsExpense: filteredTrips.reduce((sum, trip) => sum + trip.spent, 0),
      approvedTotal,
      pendingTotal,
      expenses: filteredExpenses,
      categoryBreakdown,
      monthlyData,
      trips: filteredTrips
    };

    this.reportGenerated = true;
  }

  exportToCSV(): void {
    let csvContent = '';

    if (this.selectedReportType === 'expense') {
      csvContent = 'Date,Category,Description,Amount,Status\n';
      this.reportData.expenses.forEach(exp => {
        csvContent += `${exp.date},${exp.category},${exp.description},${exp.amount},${exp.status}\n`;
      });
    } else if (this.selectedReportType === 'category') {
      csvContent = 'Category,Count,Amount,Percentage\n';
      this.reportData.categoryBreakdown.forEach(cat => {
        csvContent += `${cat.category},${cat.count},${cat.amount},${cat.percentage}%\n`;
      });
    } else if (this.selectedReportType === 'trips') {
      csvContent = 'Trip Name,Destination,Start Date,End Date,Budget,Spent,Status\n';
      this.reportData.trips.forEach(trip => {
        csvContent += `${trip.name},${trip.destination},${trip.startDate},${trip.endDate},${trip.budget},${trip.spent},${trip.status}\n`;
      });
    }

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.selectedReportType}-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  printReport(): void {
    window.print();
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

  getTripStatusClass(status: string): string {
    const classes: {[key: string]: string} = {
      'Pending': 'bg-warning',
      'Active': 'bg-primary',
      'Completed': 'bg-success'
    };
    return classes[status] || 'bg-secondary';
  }
}

