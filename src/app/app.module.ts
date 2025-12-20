import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './modules/sidebar/sidebar.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { TripsComponent } from './modules/trips/trips.component';
import { ReportsComponent } from './modules/reports/reports.component';
import { BudgetComponent } from './modules/budget/budget.component';
import { AnalyticsComponent } from './modules/analytics/analytics.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    DashboardComponent,
    TripsComponent,
    ReportsComponent,
    BudgetComponent,
    AnalyticsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}