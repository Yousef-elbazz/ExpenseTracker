import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Expense } from '../../models/expense';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit {
  expenses: Expense[] = [];
  displayedColumns: string[] = ['date', 'description', 'category', 'amount', 'actions'];

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses() {
    this.apiService.getExpenses().subscribe(data => {
      this.expenses = data;
    });
  }

  editExpense(id: number) {
    this.router.navigate(['/edit-expense', id]);
  }

  deleteExpense(id: number) {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.apiService.deleteExpense(id).subscribe(() => {
        this.expenses = this.expenses.filter(e => e.id !== id);
      });
    }
  }
}
