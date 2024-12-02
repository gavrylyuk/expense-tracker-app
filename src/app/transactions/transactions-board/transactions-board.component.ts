import { Component, inject, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { TransactionCategoryService } from '../services/transaction-category.service';
import { TransactionsService } from '../services/transactions.service';
import { Transaction, TransactionType, TransactionTypeValue } from '../models/transaction';
import { Category } from '../models/category';


@Component({
  selector: 'app-transactions-board',
  imports: [
    ReactiveFormsModule,
    MatSelectModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    CurrencyPipe,
    DatePipe,
  ],
  templateUrl: './transactions-board.component.html',
  styleUrl: './transactions-board.component.css',
})
export class TransactionsBoardComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  private readonly transationCategoryService: TransactionCategoryService = inject(TransactionCategoryService);
  private readonly transactionsService: TransactionsService = inject(TransactionsService);
  private transactionList: Transaction[] = [];
  public categoryList: Category[] = [];
  public readonly TransactionTypeValue: typeof TransactionTypeValue = TransactionTypeValue;
  public readonly filterOptions = inject(FormBuilder).group({
    filterCategory: [],
    filterType: [],
  });
  public readonly displayedColumns: string[] = ['transactionName', 'category', 'amount', 'createDate'];
  public dataSource: MatTableDataSource<Transaction> = new MatTableDataSource<Transaction>();

  @ViewChild(MatSort) sort!: MatSort;


  ngOnInit(): void {
    this.subscribeForTransactionListData();
    this.getCategoryListByTransactionType();
    this.subscribeForFilterOptionsFormChange();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  private subscribeForFilterOptionsFormChange(): void {
    this.subscriptions.push(this.filterOptions.controls['filterType'].valueChanges.subscribe((value: TransactionType | null) => {
      this.filterOptions.controls['filterCategory'].reset();
      this.getCategoryListByTransactionType();
      this.setDataSource(this.filterByType(value));

    }));
    this.subscriptions.push(this.filterOptions.controls['filterCategory'].valueChanges.subscribe((value: number | null) => {
      this.setDataSource(this.filterByCategory(value));
    }));
  }

  private subscribeForTransactionListData(): void {
    this.subscriptions.push(this.transactionsService.transactionList$.subscribe((transactionList: Transaction[]) => {
      this.transactionList = [...transactionList];
      this.setDataSource(transactionList);
    }));
  }

  private setDataSource(transactionList: Transaction[]): void {
    this.dataSource.data = [...transactionList];
    this.dataSource.sort = this.sort;
  }

  private filterByType(type: TransactionType | null): Transaction[] {
    return type ? (this.transactionList.filter((transaction: Transaction) => transaction.type === type) || []) : this.transactionList;
  }

  private filterByCategory(filterCategoryId: number | null): Transaction[] {
    return filterCategoryId ? this.transactionList.filter((transaction: Transaction) => transaction.categoryId === filterCategoryId) || [] : this.transactionList;
  }

  private getCategoryListByTransactionType(): void {
    const type: TransactionType | null = this.filterOptions.value['filterType'] as TransactionType | null;
    this.categoryList = this.transationCategoryService.getTransactionCategoryList();
    if (type) this.categoryList = this.categoryList.filter((category: Category) => category.categoryTransdationType === type);
  }

}
