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

export enum SuccessMessages {
  SIGN_IN = 'You’re signed in successfully!',
  PASSWORD_RESET_LINK ='Password reset link sent successfully!',
  SIGN_UP = 'Your account has been created successfully.',
  CURRENCY = 'Your preferred currency has been saved successfully!',
  ACCOUNT_SUCCESS = 'Your Account has been saved successfully!',
  ONBOARDING_SUCCESS = 'Your profile has been set up successfully. Welcome to My Wallet!'
}

export enum ErrorMessages {
  PROFILE_NOT_FOUND = 'We couldn’t find your user profile. Please contact support for assistance.',
  PASSWORD_RESET_LINK_FAILED = 'Failed to send password reset link.',
  SIGNUP_FAILED = 'Unable to create your account. Please try again.',
  SESSION_TIMEOUT = 'Your session has expired. Please sign in again to continue.',
  CURRENCY_FAILED = 'Unable to save your preferred currency. Please try again.',
  ACCOUNT_FAILED = 'Unable to save your account. Please try again.',
  ONBOARDING_FAILED = 'Unable to complete your profile setup. Please try again.'


  
}

export enum ValidationMessages {
  EMAIL = 'Please enter your email address.',
  INVALID_EMAIL = 'Please enter a valid email address.',
  PASSWORD = 'Please enter password.',
  PASSWORD_MIN_LENGTH = 'Password must be at least 6 characters long.',
  PASSWORD_MATCHING = 'Passwords do not match.',
  NAME = 'Please enter your full name.',
  CONFIRM_PASSWORD = 'Please re-enter the password'
}