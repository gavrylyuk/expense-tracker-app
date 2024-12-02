import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  // TODO this logic with restore state need to be implement with IndexedDB instead of Local Storage

  public setToLocalStorage(transactionList: Transaction[]): void {
    if (transactionList && transactionList.length) localStorage.setItem('transactions', JSON.stringify(transactionList));
  };

  public getFromLocalStorage(): Transaction[] {
    const transactionsValue: string | null = localStorage.getItem('transactions');
    return transactionsValue ? JSON.parse(transactionsValue) : [];
  }

}
