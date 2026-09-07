import { Component, input, output } from '@angular/core';
import { Expense } from '../../models/expense.model';

@Component({
  standalone: true,
  selector: 'app-expense-list',
  styleUrl: './expense-list.scss',
  templateUrl: './expense-list.html',
})
export class ExpenseList {
  readonly expenses = input<Expense[]>([]);
  readonly editRequested = output<Expense>();
  readonly deleteRequested = output<Expense>();
}
