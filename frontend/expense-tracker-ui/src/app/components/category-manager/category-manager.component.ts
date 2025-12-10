import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ApiService } from '../../services/api.service';
import { Category } from '../../models/category';

@Component({
  selector: 'app-category-manager',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatListModule,
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
    this.apiService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  addCategory() {
    if (this.newCategoryName.trim()) {
      const newCategory: Category = { id: 0, name: this.newCategoryName };
      this.apiService.addCategory(newCategory).subscribe(category => {
        this.categories.push(category);
        this.newCategoryName = '';
      });
    }
  }

  deleteCategory(id: number) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.apiService.deleteCategory(id).subscribe(() => {
        this.categories = this.categories.filter(c => c.id !== id);
      });
    }
  }
}
