import { Timestamp } from "firebase/firestore";
import { PaymentMode, TransactionType } from "../types/application-types";

export interface TransactionForm {
    id: string;
    name: string;
    type: TransactionType;
    categoryId: string;
    accountId: string;
    description: string;
    date: string;
    time: string;
    amount: number;
    currency: string;
    paymentMode: PaymentMode;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
    transactionAt?: Timestamp;
}