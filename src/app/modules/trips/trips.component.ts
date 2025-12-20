import { Component } from '@angular/core';

interface TripExpense {
  date: string;
  category: string;
  amount: number;
  description: string;
  receipt?: string;
}

interface Trip {
  name: string;
  destination: string;
  purpose: string;
  startDate: string;
  endDate: string;
  budget: number | null;
  travelers: number;
  description: string;
  status: 'Pending' | 'Active' | 'Completed';
  spent?: number;
  createdDate: string;
  expenses: TripExpense[];
}

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css']
})
export class TripsComponent {
  trips: Trip[] = [];
  showTripForm: boolean = false;
  editingTripIndex: number | null = null;
  currentFilter: string = 'all';
  Math = Math; // Expose Math to template
  
  // Expense tracking
  showExpenseForm: boolean = false;
  currentTripIndex: number | null = null;
  currentExpense: TripExpense = {
    date: '',
    category: '',
    amount: 0,
    description: ''
  };

  currentTrip: Trip = {
    name: '',
    destination: '',
    purpose: '',
    startDate: '',
    endDate: '',
    budget: null,
    travelers: 1,
    description: '',
    status: 'Pending',
    spent: 0,
    createdDate: new Date().toISOString().split('T')[0],
    expenses: []
  };

  openTripForm(): void {
    this.showTripForm = true;
    this.editingTripIndex = null;
    this.resetTripForm();
  }

  cancelTripForm(): void {
    this.showTripForm = false;
    this.editingTripIndex = null;
    this.resetTripForm();
  }

  resetTripForm(): void {
    this.currentTrip = {
      name: '',
      destination: '',
      purpose: '',
      startDate: '',
      endDate: '',
      budget: null,
      travelers: 1,
      description: '',
      status: 'Pending',
      spent: 0,
      createdDate: new Date().toISOString().split('T')[0],
      expenses: []
    };
  }

  saveTrip(): void {
    if (!this.currentTrip.name || !this.currentTrip.destination || 
        !this.currentTrip.startDate || !this.currentTrip.endDate || 
        !this.currentTrip.budget) {
      alert('Please fill in all required fields: Name, Destination, Dates, and Budget.');
      return;
    }

    if (new Date(this.currentTrip.startDate) > new Date(this.currentTrip.endDate)) {
      alert('End date must be after start date.');
      return;
    }

    if (this.editingTripIndex !== null) {
      // Update existing trip
      this.trips[this.editingTripIndex] = { ...this.currentTrip };
      console.log('Trip updated:', this.trips[this.editingTripIndex]);
    } else {
      // Add new trip
      this.trips.push({ ...this.currentTrip });
      console.log('Trip added:', this.currentTrip);
    }

    this.cancelTripForm();
  }

  editTrip(index: number): void {
    this.editingTripIndex = index;
    this.currentTrip = { ...this.trips[index] };
    this.showTripForm = true;
  }

  deleteTrip(index: number): void {
    if (confirm('Are you sure you want to delete this trip?')) {
      const deletedTrip = this.trips[index];
      this.trips.splice(index, 1);
      console.log('Trip deleted:', deletedTrip);
    }
  }

  approveTrip(index: number): void {
    this.trips[index].status = 'Active';
    console.log('Trip approved:', this.trips[index]);
  }

  completeTrip(index: number): void {
    this.trips[index].status = 'Completed';
    console.log('Trip completed:', this.trips[index]);
  }

  setFilter(filter: string): void {
    this.currentFilter = filter;
  }

  getAllTrips(): Trip[] {
    return this.trips;
  }

  getActiveTrips(): Trip[] {
    return this.trips.filter(trip => trip.status === 'Active');
  }

  getPendingTrips(): Trip[] {
    return this.trips.filter(trip => trip.status === 'Pending');
  }

  getCompletedTrips(): Trip[] {
    return this.trips.filter(trip => trip.status === 'Completed');
  }

  getFilteredTrips(): Trip[] {
    switch (this.currentFilter) {
      case 'active':
        return this.getActiveTrips();
      case 'pending':
        return this.getPendingTrips();
      case 'completed':
        return this.getCompletedTrips();
      default:
        return this.getAllTrips();
    }
  }

  getTotalSpent(): number {
    return this.trips.reduce((sum, trip) => sum + (trip.spent || 0), 0);
  }

  getSpentPercentage(trip: Trip): number {
    if (!trip.budget || trip.budget === 0) return 0;
    return Math.round(((trip.spent || 0) / trip.budget) * 100);
  }

  getStatusBadgeClass(status: string): string {
    const classes: {[key: string]: string} = {
      'Pending': 'bg-warning',
      'Active': 'bg-primary',
      'Completed': 'bg-success'
    };
    return classes[status] || 'bg-secondary';
  }

  // Expense Management Methods
  openExpenseForm(tripIndex: number): void {
    this.currentTripIndex = tripIndex;
    this.showExpenseForm = true;
    this.currentExpense = {
      date: new Date().toISOString().split('T')[0],
      category: '',
      amount: 0,
      description: ''
    };
  }

  closeExpenseForm(): void {
    this.showExpenseForm = false;
    this.currentTripIndex = null;
  }

  addExpense(): void {
    if (this.currentTripIndex === null) return;
    
    if (!this.currentExpense.date || !this.currentExpense.category || !this.currentExpense.amount) {
      alert('Please fill in Date, Category, and Amount.');
      return;
    }

    const trip = this.trips[this.currentTripIndex];
    trip.expenses.push({ ...this.currentExpense });
    
    // Update spent amount
    trip.spent = trip.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    console.log('Expense added to trip:', this.currentExpense);
    this.closeExpenseForm();
  }

  deleteExpense(tripIndex: number, expenseIndex: number): void {
    if (confirm('Delete this expense?')) {
      this.trips[tripIndex].expenses.splice(expenseIndex, 1);
      // Recalculate spent amount
      this.trips[tripIndex].spent = this.trips[tripIndex].expenses.reduce((sum, exp) => sum + exp.amount, 0);
    }
  }

  getTripExpenses(tripIndex: number): TripExpense[] {
    return this.trips[tripIndex]?.expenses || [];
  }
}
