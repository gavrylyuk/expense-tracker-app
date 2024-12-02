import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { TransactionsService } from '../services/transactions.service';
import { Transaction, TransactionTypeValue } from '../models/transaction';
import { TransactionCategoryService } from '../services/transaction-category.service';



@Component({
  selector: 'app-transactions-balance',
  imports: [MatDialogModule, MatDividerModule, MatButtonModule, CurrencyPipe,],
  templateUrl: './transactions-balance.component.html',
  styleUrl: './transactions-balance.component.css',
})
export class TransactionsBalanceComponent {
  private readonly transationCategoryService: TransactionCategoryService = inject(TransactionCategoryService);
  public readonly transactionsService: TransactionsService = inject(TransactionsService);
  public totalExpenses = 0;
  public totalIncoms = 0;

  constructor() {

    this.transactionsService.getTransactionsList().then((transactionList: Transaction[]) => this.calculateTotalAmounts(transactionList));

  }

  private calculateTotalAmounts(transactionList: Transaction[]): void {
    transactionList.forEach((transaction: Transaction) => {
      if (transaction.type === TransactionTypeValue.EXPENSE) this.totalExpenses = this.totalExpenses + transaction.amount;
      if (transaction.type === TransactionTypeValue.INCOME) this.totalIncoms = this.totalIncoms + transaction.amount;
    })
  }
}
