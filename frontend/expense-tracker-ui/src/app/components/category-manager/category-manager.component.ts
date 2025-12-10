import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ApiService } from '../../services/api.service';
import { Category } from '../../models/category';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category-manager',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './category-manager.component.html',
  styleUrl: './category-manager.component.css'
})
export class CategoryManagerComponent implements OnInit {
  categories: Category[] = [];
  newCategoryName: string = '';

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadCategories();
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

  addCategory() {
    if (this.newCategoryName.trim()) {
      const newCategory: Category = { id: 0, name: this.newCategoryName };
      this.apiService.addCategory(newCategory).subscribe({
        next: (category) => {
          this.categories.push(category);
          this.newCategoryName = '';
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: `Category "${category.name}" added successfully`,
            timer: 2000,
            showConfirmButton: false,
            iconColor: '#667eea'
          });
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to add category',
            confirmButtonColor: '#667eea'
          });
        }
      });
    }
  }

  deleteCategory(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#667eea',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.deleteCategory(id).subscribe({
          next: () => {
            this.categories = this.categories.filter(c => c.id !== id);
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Category has been deleted.',
              timer: 2000,
              showConfirmButton: false,
              iconColor: '#667eea'
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to delete category',
              confirmButtonColor: '#667eea'
            });
          }
        });
      }
    });
  }
}
