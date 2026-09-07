import { Routes } from '@angular/router';
import { ExpensesPage } from './features/expenses/pages/expenses-page/expenses-page';

export const routes: Routes = [
	{ path: '', component: ExpensesPage },
	{ path: '**', redirectTo: '' },
];
