import { Category } from "./category";

export declare type TransactionType = 'income' | 'expense';

export enum TransactionTypeValue {
    INCOME = 'income',
    EXPENSE = 'expense'
}

export interface Transaction {
    transactionId: number,
    transactionName: string,
    type: TransactionType
    categoryId: number,
    category: Category | undefined,
    amount: number,
    createDate: string,
    updateDate: string,
}
