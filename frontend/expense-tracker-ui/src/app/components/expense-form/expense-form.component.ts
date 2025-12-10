import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Category } from '../../models/category';
import { Expense } from '../../models/expense';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './expense-form.component.html',
  styleUrl: './expense-form.component.css'
})
export class ExpenseFormComponent implements OnInit {
  expenseForm: FormGroup;
  categories: Category[] = [];
  isEditMode: boolean = false;
  expenseId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.expenseForm = this.fb.group({
      description: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      date: [new Date(), Validators.required],
      categoryId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.expenseId = +id;
        this.loadExpense(this.expenseId);
      }
    });
  }

  loadCategories() {
    this.apiService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load categories',
          confirmButtonColor: '#667eea'
        });
      }
    });
  }

  loadExpense(id: number) {
    this.apiService.getExpenses().subscribe({
      next: (expenses) => {
        const expense = expenses.find(e => e.id === id);
        if (expense) {
          this.expenseForm.patchValue({
            description: expense.description,
            amount: expense.amount,
            date: expense.date,
            categoryId: expense.categoryId
          });
        }
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load expense',
          confirmButtonColor: '#667eea'
        });
      }
    });
  }

  onSubmit() {
    if (this.expenseForm.valid) {
      const expenseData: Expense = {
        id: this.expenseId || 0,
        ...this.expenseForm.value
      };

      if (this.isEditMode && this.expenseId) {
        this.apiService.updateExpense(this.expenseId, expenseData).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Expense updated successfully',
              timer: 2000,
              showConfirmButton: false,
              background: '#fff',
              iconColor: '#667eea'
            }).then(() => {
              this.router.navigate(['/history']);
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to update expense',
              confirmButtonColor: '#667eea'
            });
          }
        });
      } else {
        this.apiService.addExpense(expenseData).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Expense added successfully',
              timer: 2000,
              showConfirmButton: false,
              background: '#fff',
              iconColor: '#667eea'
            }).then(() => {
              this.router.navigate(['/dashboard']);
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to add expense',
              confirmButtonColor: '#667eea'
            });
          }
        });
      }
    }
  }

  onCancel() {
    this.router.navigate(['/dashboard']);
  }
}
