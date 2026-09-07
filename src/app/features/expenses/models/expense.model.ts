export interface Expense {
  id: number;
  amount: number;
  category: string;
  description: string;
  expenseDate: string;
}

export type CreateExpenseRequest = Omit<Expense, 'id'>;