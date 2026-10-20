import { Timestamp } from "firebase/firestore";
import { TransactionType } from "../types/application-types";

export interface Category {
    id?: string;
    name: string;
    type: TransactionType;
    icon: string;
    color: string;
    isActive: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}