import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule],
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
}
