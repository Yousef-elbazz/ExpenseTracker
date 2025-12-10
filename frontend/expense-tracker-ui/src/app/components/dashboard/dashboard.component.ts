import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../services/api.service';

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

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadSummary();
  }

  loadSummary() {
    this.apiService.getMonthlySummary().subscribe(data => {
      this.totalAmount = data.total;
      this.monthlySummary = data.monthly;
    });
  }

  getCurrentMonthTotal(): number {
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const currentMonthData = this.monthlySummary.find(item => item.month.includes(currentMonth));
    return currentMonthData ? currentMonthData.total : 0;
  }
}
