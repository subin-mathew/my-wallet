import { Timestamp } from "firebase/firestore";
import { PaymentMode, TransactionType } from "../types/application-types";

export interface Transaction {
    id: string;
    name: string;
    type: TransactionType;
    categoryId: string;
    accountId: string;
    paymentMode: PaymentMode;
    description?: string;
    transactionDate: Timestamp;
    amountMinor: number;
    currency: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}