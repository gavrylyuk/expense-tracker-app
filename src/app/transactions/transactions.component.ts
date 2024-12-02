import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TransactionDialogComponent } from './transaction-dialog/transaction-dialog.component';
import { TransactionsService } from './services/transactions.service';
import { TransactionsBoardComponent } from './transactions-board/transactions-board.component';
import { Transaction } from './models/transaction';
import { LocalStorageService } from './services/local-storage.service';
import { TransactionsBalanceComponent } from './transactions-balance/transactions-balance.component';

@Component({
  selector: 'app-transactions',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterLink, MatDialogModule, TransactionsBoardComponent],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
})
export class TransactionsComponent implements OnInit, OnDestroy {
  private subscribtion: Subscription = new Subscription();
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly transactionsService: TransactionsService = inject(TransactionsService);
  private readonly localStorageService: LocalStorageService = inject(LocalStorageService);

  ngOnInit(): void {
    // TODO this get / set state need to be implement with IndexedDB instead of Local Storage
    this.transactionsService.initTransactionsList(this.localStorageService.getFromLocalStorage())
    this.subscribtion.add(this.transactionsService.transactionList$.subscribe((transactionList: Transaction[]) => this.localStorageService.setToLocalStorage(transactionList)));
    
  }

  ngOnDestroy(): void {
    this.subscribtion.unsubscribe();
  }

  public onClickAddTransaction(): void {
    this.openTransactionDialog();
  }

  public onClickEditTransaction(transactionId: number): void {
    this.openTransactionDialog(transactionId);
  }

  public onClickViewTotalBalance(): void {
    this.dialog.open(TransactionsBalanceComponent);
  }

  private openTransactionDialog(transactionId?: number): void {
    const dialogRef: MatDialogRef<TransactionDialogComponent> = this.dialog.open(TransactionDialogComponent, {
      data: transactionId,
    });

    dialogRef.afterClosed().subscribe((result: Transaction) => {
      if (result) this.transactionsService.addTransaction(result);
    });
  }
}
