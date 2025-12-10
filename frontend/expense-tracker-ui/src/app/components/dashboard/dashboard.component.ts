import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../services/api.service';
import { Expense } from '../../models/expense';

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

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadSummary();
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
}
