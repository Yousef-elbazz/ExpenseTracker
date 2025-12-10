import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ExpenseFormComponent } from './components/expense-form/expense-form.component';
import { CategoryManagerComponent } from './components/category-manager/category-manager.component';
import { HistoryComponent } from './components/history/history.component';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'add-expense', component: ExpenseFormComponent },
    { path: 'edit-expense/:id', component: ExpenseFormComponent },
    { path: 'categories', component: CategoryManagerComponent },
    { path: 'history', component: HistoryComponent }
];
