import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import {
  faArrowRight,
  faArrowLeft,
  faCheck
} from '@fortawesome/free-solid-svg-icons';
import { AccountService } from '../../services/account-service';
import { Timestamp } from 'firebase/firestore';
import { Account } from '../../models/account';
import { Router } from '@angular/router';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.css'
})
export class Onboarding {
  private formbuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly accountService = inject(AccountService);
  private readonly router = inject(Router);

  // Font Awesome Icons 
  faArrowRight = faArrowRight;
  faArrowLeft = faArrowLeft;
  faCheck = faCheck;

  // Onboarding 
  currentSection = 0;

  // Currency 
  selectedCurrency = '';
  selectedCountry = '';


  currencies = [
    {
      name: 'Indian Rupee',
      code: 'INR',
      symbol: '₹',
      country: 'India',
      flag: '🇮🇳'
    },
    {
      name: 'UAE Dirham',
      code: 'AED',
      symbol: 'د.إ',
      country: 'United Arab Emirates',
      flag: '🇦🇪'
    },
    {
      name: 'US Dollar',
      code: 'USD',
      symbol: '$',
      country: 'United States',
      flag: '🇺🇸'
    },
    {
      name: 'Euro',
      code: 'EUR',
      symbol: '€',
      country: 'European Union',
      flag: '🇪🇺'
    }
  ];

  // Account 
  selectedAccount = 'bank';

  // Onboarding Form 
  accountForm: FormGroup;


  constructor(private fb: FormBuilder) {

    this.accountForm = this.fb.group({

      // Bank Account 
      accountName: [''],
      bankAccountType: [''],
      bankName: [''],
      balance: [],

      // Credit Card 
      cardName: [''],
      creditLimit: [],
      currentOutstanding: [],
      minimumAmountDue: [],
      paymentDueDate: [null],

    });
    this.updateAccountValidators();
  }


  // -------------------------------------------------- 
  // Navigation 
  // -------------------------------------------------- 

  previous(): void {

    if (this.currentSection > 0) {
      this.currentSection--;
    }

  }

  next(): void {
    console.log("calling next method");
    console.log(this.currentSection);

    this.currentSection++;
    console.log(this.currentSection);
  }



  // -------------------------------------------------- 
  // Currency Selection 
  // -------------------------------------------------- 

  selectCurrency(currency: string, country: string): void {

    this.selectedCurrency = currency;
    this.selectedCountry = country;

    console.log(this.selectedCurrency)
    console.log(this.selectedCountry);

  }

  // Account Selection 
  selectAccount(type: string): void {
    // Update selected account type
    this.selectedAccount = type;

    // // Reset interaction state for all fields
    // Object.keys(this.accountForm.controls).forEach(fieldName => {
    //   const control = this.accountForm.get(fieldName);

    //   control?.markAsUntouched();
    //   control?.markAsPristine();
    // });
    // Reset all form values and validation states
    this.accountForm.reset({
      accountName: '',
      bankAccountType: '',
      bankName: '',
      balance: null,
      cardName: '',
      creditLimit: null,
      currentOutstanding: null,
      minimumAmountDue: null,
      paymentDueDate: null,
      walletProvider: ''
    });
    // Apply validators for the selected account type
    this.updateAccountValidators();
  }

  async saveCurrency(): Promise<boolean> {
    const user = this.authService.getCurrentUser();

    if (!user) {
      console.error('No authenticated user found. Currency was not saved.');
      return false;
    }

    try {
      this.authService.updateCurrencies(
        user.uid,
        this.selectedCurrency,
        this.selectedCountry
      );
      this.next();
      console.log('Currency saved successfully.');
      return true;
    } catch (error) {
      console.error('Error saving currency:', error);
      return false;
    }

  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.accountForm.get(fieldName);

    return !!(
      control &&
      control.invalid &&
      (control.touched || control.dirty)
    );
  }


  async saveAccount(): Promise<void> {
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      return;
    }

    const user = this.authService.getCurrentUser();
    console.log(user);

    if (!user) {
      console.error('User is not logged in');
      return;
    }

    const account = this.buildAccount(this.accountForm.value);
    try {
      const accountId = this.accountService.addAccount(user.uid, account);
      console.log(accountId);
      if (!accountId) {
        console.error('Account creation failed: no account ID returned');
        return;
      }
      console.log('Moving to next section...');
      this.currentSection++;
    } catch (error) {
      console.error('Failed to create account:', error);
    }
  }

  private buildAccount(accountFormValue: any): any {

    const now = Timestamp.now();

    const account: Account = {
      accountName: accountFormValue.accountName,
      accountType: this.selectedAccount,
      balanceMinor: accountFormValue.balance,
      isActive: true,
      createdAt: now,
      updatedAt: now
    }

    //Bank 
    if (this.selectedAccount === 'bank') {
      account.bankAccountType = accountFormValue.bankAccountType;
      account.bankName = accountFormValue.bankName;
    }

    //Credit Card 
    if (this.selectedAccount === 'credit-card') {
      account.bankName = accountFormValue.bankName;
      account.creditLimitMinor = accountFormValue.creditLimit;
      account.currentOutstandingMinor = accountFormValue.currentOutstanding;
      account.minimumAmountDueMinor = accountFormValue.minimumAmountDue;
      account.paymentDueDate = accountFormValue.paymentDueDate;
      account.balanceMinor = 0;
    }

    return account;
  }

  updateAccountValidators(): void {

    // Step 1: Clear validators from all fields
    Object.keys(this.accountForm.controls).forEach(fieldName => {
      const control = this.accountForm.get(fieldName);

      control?.clearValidators();
      control?.setErrors(null);
    });

    // Step 2: Apply validators for the selected account type
    switch (this.selectedAccount) {

      case 'bank':

        this.accountForm.get('accountName')?.setValidators([
          Validators.required
        ]);

        this.accountForm.get('bankAccountType')?.setValidators([
          Validators.required
        ]);

        this.accountForm.get('bankName')?.setValidators([
          Validators.required
        ]);

        this.accountForm.get('balance')?.setValidators([
          Validators.required,
          Validators.min(0)
        ]);

        break;

      case 'credit-card':
        this.accountForm.get('accountName')?.setValidators([
          Validators.required
        ]);

        this.accountForm.get('bankName')?.setValidators([
          Validators.required
        ]);

        this.accountForm.get('creditLimit')?.setValidators([
          Validators.required,
          Validators.min(0)
        ]);

        this.accountForm.get('currentOutstanding')?.setValidators([
          Validators.required,
          Validators.min(0)
        ]);

        this.accountForm.get('minimumAmountDue')?.setValidators([
          Validators.required,
          Validators.min(0)
        ]);

        this.accountForm.get('paymentDueDate')?.setValidators([
          Validators.required
        ]);

        break;

      case 'cash':

        this.accountForm.get('accountName')?.setValidators([
          Validators.required
        ]);

        this.accountForm.get('balance')?.setValidators([
          Validators.required,
          Validators.min(0)
        ]);

        break;

      case 'digital-wallet':

        this.accountForm.get('accountName')?.setValidators([
          Validators.required
        ]);

        this.accountForm.get('balance')?.setValidators([
          Validators.required,
          Validators.min(0)
        ]);

        break;
    }

    // Step 3: Recalculate validity AFTER applying validators
    Object.keys(this.accountForm.controls).forEach(fieldName => {
      const control = this.accountForm.get(fieldName);

      control?.updateValueAndValidity({
        onlySelf: true,
        emitEvent: false
      });
    });

  }

  async completeOnboarding(): Promise<boolean> {
    const user = this.authService.getCurrentUser();

    if (!user) {
      console.error('No authenticated user found. Currency was not saved.');
      return false;
    }

    try {
      const profileCompleteFlag =
        await this.authService.updateProfileCompleteFlag(user.uid, true);

      if (profileCompleteFlag) {
        await this.router.navigate(['/home']);
        console.log('Profile completed successfully.');
        return true;
      } else {
        return false;
      }

    } catch (error) {
      console.error('Error saving currency:', error);
      return false;
    }

  }
} 