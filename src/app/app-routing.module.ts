import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { TripsComponent } from './modules/trips/trips.component';
import { ReportsComponent } from './modules/reports/reports.component';
import { BudgetComponent } from './modules/budget/budget.component';
import { AnalyticsComponent } from './modules/analytics/analytics.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'trips', component: TripsComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'budget', component: BudgetComponent },
  { path: 'analytics', component: AnalyticsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
