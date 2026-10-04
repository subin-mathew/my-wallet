import { Timestamp } from 'firebase/firestore';

export interface Account {
  id?: string;
  accountType: string;
  bankAccountType?: string;
  accountName?: string;
  balanceMinor?: number;
  bankName?: string;
  
  creditLimitMinor?: number;
  currentOutstandingMinor?: number;
  minimumAmountDueMinor?: number;
  paymentDueDate?: Date;
  
  walletProvider?: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}