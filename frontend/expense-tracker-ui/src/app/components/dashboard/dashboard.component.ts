import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../services/api.service';
import { Expense } from '../../models/expense';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  totalAmount: number = 0;
  monthlySummary: any[] = [];
  totalTransactions: number = 0;
  currentMonthTotal: number = 0;
  budgetLimit: number = 0;
  budgetPercentage: number = 0;
  showBudgetWarning: boolean = false;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadSummary();
    this.loadBudget();
  }

  loadSummary() {
    this.apiService.getExpenses().subscribe(expenses => {
      // Calculate total amount
      this.totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      
      // Calculate total transactions
      this.totalTransactions = expenses.length;
      
      // Calculate current month total
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      
      this.currentMonthTotal = expenses
        .filter(exp => {
          const expDate = new Date(exp.date);
          return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
        })
        .reduce((sum, exp) => sum + exp.amount, 0);
      
      // Group by month for monthly summary
      const monthlyData: { [key: string]: number } = {};
      
      expenses.forEach(exp => {
        const expDate = new Date(exp.date);
        const monthYear = expDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        
        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = 0;
        }
        monthlyData[monthYear] += exp.amount;
      });
      
      // Convert to array and sort by date
      this.monthlySummary = Object.keys(monthlyData)
        .map(key => ({
          month: key,
          total: monthlyData[key]
        }))
        .sort((a, b) => new Date(b.month).getTime() - new Date(a.month).getTime());
    });
  }

  getCurrentMonthTotal(): number {
    return this.currentMonthTotal;
  }

  loadBudget() {
    this.apiService.getCurrentBudget().subscribe({
      next: (budget) => {
        this.budgetLimit = budget.monthlyLimit;
        this.calculateBudgetPercentage();
      },
      error: () => {
        this.budgetLimit = 0;
      }
    });
  }

  calculateBudgetPercentage() {
    if (this.budgetLimit > 0) {
      this.budgetPercentage = (this.currentMonthTotal / this.budgetLimit) * 100;
      this.showBudgetWarning = this.budgetPercentage >= 80;
    }
  }

  setBudget() {
    Swal.fire({
      title: 'Set Monthly Budget',
      input: 'number',
      inputLabel: 'Enter your monthly budget limit',
      inputPlaceholder: 'e.g., 5000',
      showCancelButton: true,
      confirmButtonColor: '#667eea',
      cancelButtonColor: '#999',
      confirmButtonText: 'Set Budget',
      inputValidator: (value) => {
        if (!value || parseFloat(value) <= 0) {
          return 'Please enter a valid amount!';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const budget = {
          monthlyLimit: parseFloat(result.value),
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear()
        };

        this.apiService.setBudget(budget).subscribe({
          next: () => {
            this.budgetLimit = budget.monthlyLimit;
            this.calculateBudgetPercentage();
            Swal.fire({
              icon: 'success',
              title: 'Budget Set!',
              text: `Monthly budget set to ${budget.monthlyLimit}`,
              timer: 2000,
              showConfirmButton: false,
              iconColor: '#667eea'
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to set budget',
              confirmButtonColor: '#667eea'
            });
          }
        });
      }
    });
  }
}
