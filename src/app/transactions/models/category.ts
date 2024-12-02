import { TransactionType } from "./transaction";

export interface Category {
    categoryId: number,
    categoryName: string,
    categoryTransdationType: TransactionType,
}
