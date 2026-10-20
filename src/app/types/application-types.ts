export type Role = 'USER' | 'ADMIN';
export type Provider = 'PASSWORD' | 'GOOGLE';

export type DateFilterType = 'TODAY' | 'WEEK' | 'MONTH' | 'YEAR' | 'CUSTOM';
export type TransactionFormMode  = 'CREATE' | 'UPDATE' | 'VIEW';

export type AccountType = 'BANK' | 'CREDIT_CARD' | 'CASH' | 'DIGITAL_WALLET';
export type BankAccountType = 'SAVINGS' | 'CURRENT';
export type AccountStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED';

export type TransactionType = 'EXPENSE' | 'INCOME';
export type PaymentMode = 'CASH' | 'CARD' | 'UPI' | 'BANK_TRANSFER' | 'DIGITAL_WALLET';
export type CurrencyType = 'INR' | 'USD' | 'AED' | 'EUR';