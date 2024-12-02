import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatIconModule } from '@angular/material/icon';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Subscription } from 'rxjs';
import { Category } from '../models/category';
import { TransactionCategoryService } from '../services/transaction-category.service';
import { Transaction, TransactionType, TransactionTypeValue } from '../models/transaction';



@Component({
  selector: 'app-transaction-dialog',
  providers: [provideNativeDateAdapter()],
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTimepickerModule,
    MatDatepickerModule,
  ],
  templateUrl: './transaction-dialog.component.html',
  styleUrl: './transaction-dialog.component.css',
})
export class TransactionDialogComponent implements OnInit, OnDestroy {
  private readonly transationCategoryService: TransactionCategoryService = inject(TransactionCategoryService);
  private subscriptions: Subscription[] = [];
  public data: number | undefined = inject(MAT_DIALOG_DATA);
  public readonly TransactionTypeValue: typeof TransactionTypeValue = TransactionTypeValue;
  public transactionForm: FormGroup = inject(FormBuilder).group({
    transactionName: [null, Validators.required],
    amount: [null, [Validators.required, Validators.pattern(/^\s*-?[1-9]\d*(\.\d{1,2})?\s*$/)]],
    type: [TransactionTypeValue.EXPENSE as TransactionType],
    categoryId: [],
    createDate: [new Date().toISOString()],
  });

  public categoryList: Category[] = [];
  public newTransation!: Transaction;

  ngOnInit(): void {
    this.subscribeForTransactionFormChange();
    this.getCategoryListByTransactionType(this.transactionForm.value['type']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  private subscribeForTransactionFormChange(): void {
    this.subscriptions.push(this.transactionForm.valueChanges.subscribe((value: Partial<Transaction>) => this.populateNewTransaction(value)));
    this.subscriptions.push(this.transactionForm.controls['type'].valueChanges.subscribe((type: TransactionType) => this.getCategoryListByTransactionType(type)));
  }

  private populateNewTransaction(transactionFormValue: Partial<Transaction>): void {
    const { amount, ...rest } = { ...transactionFormValue };
    this.newTransation = { ...{} as Transaction, ...rest };
    if (amount) this.newTransation.amount = Math.abs(amount) * (this.newTransation.type === TransactionTypeValue.EXPENSE ? -1 : 1);
  }

  private getCategoryListByTransactionType(type: TransactionType): void {
    this.categoryList = this.transationCategoryService.getTransactionCategoryList().filter((category: Category) => category.categoryTransdationType === type);
    if (this.transactionForm.value['categoryId'] && !this.categoryList.find((category: Category) => this.transactionForm.value['categoryId'] === category.categoryId)) {
      this.transactionForm.controls['categoryId'].reset(null, { emitEvet: false });
    }
  }

  // TODO need implement 'AddNewCategory'
  // public onClickAddNewCategory(): void {
  //   console.log('onClickAddNewCategory => underconstruction')
  // }

}
