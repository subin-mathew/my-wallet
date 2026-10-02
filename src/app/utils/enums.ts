export type Role = 'USER' | 'ADMIN';
export type Provider = 'PASSWORD' | 'GOOGLE';
export type AccountStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED' | '';

export type TransactionType = 'EXPENSE' | 'EARNING';

export enum AccountType {
  BANK = 'bank',
  CREDIT_CARD = 'credit-card',
  CASH = 'cash',
  DIGITAL_WALLET = 'digital-wallet'
}