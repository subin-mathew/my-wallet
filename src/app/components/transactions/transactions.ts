import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowDown, faArrowUp, faCalendarDays, faChevronDown, faChevronUp, faClock, faClose, faCreditCard, faDownload, faEdit, faEye, faFileLines, faIndianRupeeSign, faLandmark, faMoneyBillTransfer, faPaperclip, faPlus, faReceipt, faTag, faTrashCan, faUtensils } from '@fortawesome/free-solid-svg-icons';
import { TransactionFormMode, TransactionType } from '../../types/application-types';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../models/transaction';
import { Timestamp } from 'firebase/firestore';
import { FormsModule, NgForm } from '@angular/forms';
import { Account } from '../../models/account';
import { Category } from '../../models/category';
import { Subscription } from 'rxjs';
import { TransactionService } from '../../services/transaction-service';
import { TransactionForm } from '../../forms/transaction-form';
import { firebaseAuth } from '../../config/firebase.config';
import { AccountService } from '../../services/account-service';
import { CurrencyUtils } from '../../utils/currency-utils';

@Component({
  imports: [FontAwesomeModule, CommonModule, FormsModule],
  selector: 'app-transactions',
  styleUrl: './transactions.css',
  templateUrl: './transactions.html',
})
export class Transactions implements OnInit, OnDestroy {

  readonly icons = {
    plus: faPlus, download: faDownload, edit: faEdit, view: faEye, close: faClose, expense: faArrowDown, income: faArrowUp, category: faUtensils,
    account: faLandmark, date: faCalendarDays, time: faClock, rupee: faIndianRupeeSign, card: faCreditCard, transfer: faMoneyBillTransfer,
    receipt: faReceipt, utensils: faUtensils, tag: faTag, files: faFileLines, paperclip: faPaperclip, up: faChevronUp, down: faChevronDown, trash: faTrashCan
  }

  //Variables Initializations
  accounts = signal<Account[]>([]);
  categories = signal<Category[]>([]);
  transactions = signal<Transaction[]>([]);

  transactionModal = false;
  transactionDetailsExpanded = signal(true);
  additionalDetailsExpanded = signal(false);
  transactionFormMode: TransactionFormMode = 'CREATE';

  private transactionSubscription?: Subscription;

  transaction: TransactionForm = this.createEmptyTransaction();

  constructor(
    private readonly transactionService: TransactionService,
    private readonly accountService: AccountService
  ) { }

  //Load initial data when the component starts.
  ngOnInit(): void {
    this.loadTransactions();
  }

  //Clean up resources, such as subscriptions, to prevent unnecessary background listeners and memory leaks.
  ngOnDestroy(): void {
    this.transactionSubscription?.unsubscribe();
  }

  //Method to get the current user id
  private get uid(): string | null {
    return firebaseAuth.currentUser?.uid ?? null;
  }

  //Method to get the transaction modal title
  get modalTitle(): string {
    switch (this.transactionFormMode) {
      case 'UPDATE':
        return 'Update Transaction';
      case 'VIEW':
        return 'Transaction Details';
      default:
        return 'Create Transaction';
    }
  }

  //Method to check the modal view mode/not
  get isReadOnly(): boolean {
    return this.transactionFormMode === 'VIEW';
  }

  //Method to create the empty transaction first
  private createEmptyTransaction(): TransactionForm {
    const now = new Date();
    return {
      id: '',
      name: '',
      type: 'EXPENSE',
      categoryId: '',
      accountId: '',
      description: '',
      date: this.getLocalDate(now),
      time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
      amount: 0,
      currency: 'INR',
      paymentMode: 'CASH'
    };
  }

  //Method to get the local date
  private getLocalDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  //Method to load transactions
  loadTransactions(): void {
    const uid = this.uid;
    if (!uid) {
      return;
    }
    this.transactionSubscription?.unsubscribe();
    this.transactionSubscription = this.transactionService.getTransactions(uid)
      .subscribe({
        next: (data: Transaction[]) => {
          this.transactions.set(data);
        },
        error: (error) => {
          console.error('Failed to load transactions:', error);
        }
      });
  }

  //Method for open create transaction modal
  openCreateTransaction(): void {
    this.transactionFormMode = 'CREATE';
    this.transaction = this.createEmptyTransaction();
    this.resetModalSections();
    this.transactionModal = true;
  }

  //Method for open update transaction modal
  openUpdateTransaction(item: Transaction): void {
    this.transactionFormMode = 'UPDATE';
    this.transaction = this.toFormData(item);
    this.resetModalSections();
    this.transactionModal = true;
  }

  //Method for open view transaction modal
  openViewTransaction(item: Transaction): void {
    this.transactionFormMode = 'VIEW';
    this.transaction = this.toFormData(item);
    this.resetModalSections();
    this.transactionModal = true;
  }

  //Method to convert the transaction data from firebase to transacton form data
  private toFormData(item: Transaction): TransactionForm {
    const date = item.transactionDate.toDate();
    return {
      id: item.id,
      name: item.name,
      type: item.type,
      categoryId: item.categoryId,
      accountId: item.accountId,
      description: item.description ?? '',
      date: this.getLocalDate(date),
      time: `${String(date.getHours()).padStart(2, '0')}:${String(
        date.getMinutes()
      ).padStart(2, '0')}`,
      amount: item.amountMinor / 100,
      currency: item.currency,
      paymentMode: item.paymentMode
    };
  }

  //Method to swith the transaction type
  setTransactionType(type: TransactionType): void {
    if (this.isReadOnly) {
      return;
    }
    this.transaction.type = type;
  }

  //Method to toggle the transaction details
  toggleTransactionDetails(): void {
    this.transactionDetailsExpanded.update(value => !value);
  }

  //Method to toggle the additional details
  toggleAdditionalDetails(): void {
    this.additionalDetailsExpanded.update(value => !value);
  }

  //Method to reset the transaction & additional details
  private resetModalSections(): void {
    this.transactionDetailsExpanded.set(true);
    this.additionalDetailsExpanded.set(false);
  }

  //Method to close the transaction modal
  closeTransactionModal() {
    this.transactionModal = false;
  }

  //Method to save the new transaction or update the existing transaction
  async saveTransaction(form: NgForm): Promise<void> {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    const uid = this.uid;
    if (!uid) {
      return;
    }
    if (!this.transaction.name.trim() || !this.transaction.categoryId || !this.transaction.accountId
      || !Number.isFinite(this.transaction.amount) || this.transaction.amount <= 0) {
      return;
    }
    const transactionDate = this.createTimestampFromForm();

    if (!transactionDate) {
      return;
    }

    // Amounts are stored in minor currency units (paise for INR).
    const amountMinor = CurrencyUtils.toAmountMinor(this.transaction.amount, 2)

    if (!Number.isSafeInteger(amountMinor) || amountMinor <= 0) {
      return;
    }

    const payload: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'> = {
      name: this.transaction.name.trim(),
      type: this.transaction.type,
      categoryId: this.transaction.categoryId,
      accountId: this.transaction.accountId,
      paymentMode: this.transaction.paymentMode,
      description: this.transaction.description.trim(),
      transactionDate,
      amountMinor,
      currency: this.transaction.currency
    };

    try {
      if (this.transactionFormMode === 'UPDATE') {
        await this.transactionService.updateTransaction(uid, this.transaction.id, payload);
      } else {
        await this.transactionService.addTransaction(uid, payload);
      }
      this.transactionModal = false;
    } catch (error) {
      console.error('Failed to save transaction:', error);
    }
  }

  //Method to create the transaction date from the date and time
  private createTimestampFromForm(): Timestamp | null {
    const { date, time } = this.transaction;
    if (!date || !time) {
      return null;
    }
    const parsedDate = new Date(`${date}T${time}`);
    if (Number.isNaN(parsedDate.getTime()) || this.getLocalDate(parsedDate) !== date) {
      return null;
    }
    return Timestamp.fromDate(parsedDate);
  }



}
