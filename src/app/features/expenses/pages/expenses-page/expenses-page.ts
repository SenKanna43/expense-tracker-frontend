import { Component, inject, signal } from '@angular/core';
import { ExpenseForm } from '../../components/expense-form/expense-form';
import { ExpenseList } from '../../components/expense-list/expense-list';
import { Expense } from '../../models/expense.model';
import { ExpenseService } from '../../services/ExpenseService';

@Component({
  standalone: true,
  imports: [ExpenseForm, ExpenseList],
  selector: 'app-expenses-page',
  styleUrl: './expenses-page.scss',
  templateUrl: './expenses-page.html',
})
export class ExpensesPage {
  private readonly expenseService = inject(ExpenseService);

  protected readonly expenses = signal<Expense[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly editingExpense = signal<Expense | null>(null);

  constructor() {
    this.loadExpenses();
  }

  private loadExpenses(): void {
    this.loading.set(true);
    this.error.set(null);

    this.expenseService.getExpenses().subscribe({
      next: (expenses) => {
        this.expenses.set(expenses);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Unable to load expenses.');
        this.loading.set(false);
      }
    });
  }

  protected onExpenseCreated(expense: Expense): void {
    this.expenses.update((expenses) => {
      const index = expenses.findIndex((item) => item.id === expense.id);
      if (index === -1) return [...expenses, expense];

      const updated = [...expenses];
      updated[index] = expense;
      return updated;
    });
    this.editingExpense.set(null);
  }

  protected editExpense(expense: Expense): void {
    this.editingExpense.set(expense);
  }

  protected cancelEdit(): void {
    this.editingExpense.set(null);
  }

  protected deleteExpense(expense: Expense): void {
    if (!confirm(`Delete the ${expense.description} expense?`)) return;

    this.expenseService.deleteExpense(expense.id).subscribe({
      next: () => this.expenses.update((expenses) =>
        expenses.filter((item) => item.id !== expense.id)
      ),
      error: () => this.error.set('Unable to delete the expense.'),
    });
  }
}
