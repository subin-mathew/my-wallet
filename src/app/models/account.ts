import { Timestamp } from 'firebase/firestore';
import { AccountStatus, AccountType, BankAccountType } from '../types/application-types';

export interface Account {
  id?: string;
  accountType: AccountType;
  accountName?: string;
  bankName?: string;
  bankAccountType?: BankAccountType;
  balanceMinor?: number;
  creditLimitMinor?: number;
  currentOutstandingMinor?: number;
  minimumAmountDueMinor?: number;
  paymentDueDate?: Date;
  walletProvider?: string;
  accountStatus: AccountStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}