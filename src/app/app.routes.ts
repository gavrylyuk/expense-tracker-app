import { Routes } from '@angular/router';
import { TransactionsComponent } from './transactions/transactions.component';

export const routes: Routes = [
    {
        path: '',
        component: TransactionsComponent,
        title: 'Transactions',
    },
    {
        path: '',
        redirectTo: 'transactions',
        pathMatch: 'full'
    }
];
