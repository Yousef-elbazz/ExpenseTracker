import { Category } from './category';

export interface Expense {
    id: number;
    description: string;
    amount: number;
    date: Date;
    categoryId: number;
    category?: Category;
}
