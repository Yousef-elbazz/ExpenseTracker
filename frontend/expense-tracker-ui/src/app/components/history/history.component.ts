import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Expense } from '../../models/expense';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, RouterLink, MatTableModule, MatButtonModule, MatIconModule, MatCardModule],
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
    this.apiService.getExpenses().subscribe({
      next: (data) => {
        this.expenses = data;
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load expenses',
          confirmButtonColor: '#667eea'
        });
      }
    });
  }

  editExpense(id: number) {
    this.router.navigate(['/edit-expense', id]);
  }

  deleteExpense(id: number) {
    Swal.fire({
      title: 'Delete Expense?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#667eea',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      background: '#fff',
      customClass: {
        popup: 'swal-popup',
        confirmButton: 'swal-confirm',
        cancelButton: 'swal-cancel'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.deleteExpense(id).subscribe({
          next: () => {
            this.expenses = this.expenses.filter(e => e.id !== id);
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Expense has been deleted successfully.',
              timer: 2000,
              showConfirmButton: false,
              iconColor: '#667eea'
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to delete expense',
              confirmButtonColor: '#667eea'
            });
          }
        });
      }
    });
  }
}
