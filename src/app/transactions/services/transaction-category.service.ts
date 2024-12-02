import { Injectable } from '@angular/core';
import { Category } from '../models/category';
import { firstUseCategory } from '../../assests/category-mock-data';

@Injectable({
  providedIn: 'root'
})
export class TransactionCategoryService {

  public getTransactionCategoryList(): Category[] {
    return firstUseCategory
  }

  // TODO replace this by 'right' request into DB
  public getTransactionCategoryById(categoryId: number): Category | undefined {
    return firstUseCategory.find((item: Category) => item.categoryId == categoryId);
  }

  public addTransactionCategory(newCategory: Category): void {
    console.log(newCategory)
  }

}
