import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Transaction } from '../models/transaction';
import { TransactionCategoryService } from './transaction-category.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private readonly transationCategoryService: TransactionCategoryService = inject(TransactionCategoryService);

  private transactionListBehaviourSubject: BehaviorSubject<Transaction[]> = new BehaviorSubject<Transaction[]>([]);
  public transactionList$: Observable<Transaction[]> = this.transactionListBehaviourSubject.asObservable();

  public addTransaction(transaction: Transaction): void {
    this.transactionListBehaviourSubject.next([...this.transactionListBehaviourSubject.getValue(), this.populateTransactionCategory(transaction)]);
  }

  public updateTransaction(transaction: Transaction): void {
    const transactionListValue: Transaction[] = this.transactionListBehaviourSubject.getValue();
    const index: number = transactionListValue.findIndex((item: Transaction) => item.transactionId === transaction.transactionId);
    transactionListValue[index] = this.populateTransactionCategory(transaction);
    this.transactionListBehaviourSubject.next(transactionListValue);
  }

  public getTransactionById(transactionId: number): Transaction | undefined {
    return this.transactionListBehaviourSubject.getValue().find((item: Transaction) => item.transactionId === transactionId);
  }

  public deleteTransactionById(transactionId: number): void {
    const transactionListValue: Transaction[] = this.transactionListBehaviourSubject.getValue();
    const index: number = transactionListValue.findIndex((item: Transaction) => item.transactionId === transactionId);
    transactionListValue.splice(index, 1);
    this.transactionListBehaviourSubject.next(transactionListValue);
  }

  public async getTransactionsList(): Promise<Transaction[]> {
     return this.transactionListBehaviourSubject.getValue();
  }

  // TODO replace this by 'right' request into DB (in case of IndexedDB)
  private populateTransactionCategory(transaction: Transaction): Transaction {
    transaction.category = this.transationCategoryService.getTransactionCategoryById(transaction.categoryId);
    return transaction;
  }

  // TODO this logic with restore state need to be implement with IndexedDB instead of Local Storage
  public initTransactionsList(transactionList: Transaction[]): void {
    this.transactionListBehaviourSubject.next(transactionList);
  }

}
