import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Category } from '../../models/category';
import { Expense } from '../../models/expense';

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
    MatButtonModule
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
    this.apiService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  loadExpense(id: number) {
    // Since we don't have getExpenseById in ApiService (I missed it in plan), 
    // I should add it or just find it from list if list is cached, 
    // but better to add it or just use getExpenses and find.
    // For simplicity, I'll fetch all and find. Ideally should be an endpoint.
    this.apiService.getExpenses().subscribe(expenses => {
      const expense = expenses.find(e => e.id === id);
      if (expense) {
        this.expenseForm.patchValue({
          description: expense.description,
          amount: expense.amount,
          date: expense.date,
          categoryId: expense.categoryId
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
        this.apiService.updateExpense(this.expenseId, expenseData).subscribe(() => {
          this.router.navigate(['/history']);
        });
      } else {
        this.apiService.addExpense(expenseData).subscribe(() => {
          this.router.navigate(['/dashboard']);
        });
      }
    }
  }

  onCancel() {
    this.router.navigate(['/dashboard']);
  }
}
