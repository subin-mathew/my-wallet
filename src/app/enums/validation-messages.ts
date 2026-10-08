export enum ValidationMessages {
  EMAIL_REQUIRED = 'Please enter your email address.',
  EMAIL_INVALID = 'Please enter a valid email address.',

  PASSWORD_REQUIRED = 'Please enter password.',
  PASSWORD_MINLENGTH = 'Password must be at least 6 characters long.',
  PASSWORD_VERIFYING = 'Passwords do not match.',
  CONFIRM_PASSWORD_REQUIRED = 'Please re-enter the password',
  
  NAME = 'Please enter your full name.',

  ACCOUNT_NAME_REQUIRED = 'Please enter your account name.',
  ACCOUNT_TYPE_REQUIRED = 'Please select an account type.',
  BANK_NAME_REQUIRED = 'Please enter your bank name.',
  BALANCE_REQUIRED = 'Please enter your balance.',
  BALANCE_NEGATIVE = 'Balance must be greater than zero.',

  CARD_NAME_REQUIRED = 'Please enter your card name',
  CREDIT_LIMIT_REQUIRED = 'Please enter your credit limit.',
  CREDIT_LIMIT_NEGATIVE = 'Credit limit must be greater than zero.',
  CURRENT_OUTSTANDING_REQUIRED = 'Please enter your current outstanding.',
  CURRENT_OUTSTANDING_NEGATIVE = 'Current outstanding must be greater than zero.',
  MINIMUM_DUE_AMOUNT_REQUIRED = 'Please enter your minimum due amount.',
  MINIMUM_DUE_AMOUNT_NEGATIVE = 'Minimum due amount must be greater than zero.',
  PAYMENT_DUE_DATE = 'Please enter your payment due date',

  WALLET_PROVIDER_REQUIRED = 'Please select a wallet provider'



 
}