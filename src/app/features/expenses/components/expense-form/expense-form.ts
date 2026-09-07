import { Component, effect, inject, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpenseService } from '../../services/ExpenseService';
import { Expense } from '../../models/expense.model';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  selector: 'app-expense-form',
  styleUrl: './expense-form.scss',
  templateUrl: './expense-form.html',
})
export class ExpenseForm {

  private readonly expenseService = inject(ExpenseService);

  readonly editingExpense = input<Expense | null>(null);
  readonly saved = output<Expense>();
  readonly cancelled = output<void>();

  protected readonly expenseForm = new FormGroup({
    amount: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0.01)
    ]),

    category: new FormControl('', {
      validators: [Validators.required]
    }),

    description: new FormControl('', {
      validators: [Validators.required]
    }),

    expenseDate: new FormControl('', {
      validators: [Validators.required]
    })
  });

  constructor() {
    effect(() => {
      const expense = this.editingExpense();

      if (expense) {
        this.expenseForm.patchValue({
          amount: expense.amount,
          category: expense.category,
          description: expense.description,
          expenseDate: expense.expenseDate,
        });
      } else {
        this.expenseForm.reset();
      }
    });
  }

  protected submit(): void {
    if (this.expenseForm.invalid) {
      this.expenseForm.markAllAsTouched();
      return;
    }

  const formValue = this.expenseForm.getRawValue();

    const request = {
      amount: formValue.amount!,
      category: formValue.category!,
      description: formValue.description!,
      expenseDate: formValue.expenseDate!,
    };
    const expense = this.editingExpense();
    const request$ = expense
      ? this.expenseService.updateExpense(expense.id, request)
      : this.expenseService.createExpense(request);

    request$.subscribe({
      next: (savedExpense) => {
        this.saved.emit(savedExpense);
        this.expenseForm.reset();
      },
      error: (error) => console.error('Failed to save expense:', error),
    });
  }

  protected cancel(): void {
    this.expenseForm.reset();
    this.cancelled.emit();
  }

}
