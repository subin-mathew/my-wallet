import { Injectable, Service } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { firebaseStore } from '../config/firebase.config';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction';

@Injectable({
    providedIn: 'root',
})
export class TransactionService {

    private getTransactionCollection(uid: string) {
        return collection(firebaseStore, 'users', uid, 'transactions');
    }

    //Service to get all the transactions of a user from firestore db
    getTransactions(uid: string): Observable<Transaction[]> {
        const transactionsRef = collection( firebaseStore, 'users', uid, 'transactions' );
        return new Observable<Transaction[]>(observer => {
            const unsubscribe = onSnapshot(
                transactionsRef,
                snapshot => {
                    const transactions: Transaction[] = snapshot.docs.map(doc => ({
                        ...doc.data(),
                        id: doc.id
                    })) as Transaction[];
                    observer.next(transactions);
                },
                error => observer.error(error)
            );
            return () => unsubscribe();
        });
    }

    //Service to get  transactions by id of a user from firestore db
    getTransactionById(uid: string, transactionId: string): Observable<Transaction | null> {
        const transactionRef = doc(firebaseStore, 'users', uid, 'transactions', transactionId);
        return new Observable<Transaction | null>(observer => {
            const unsubscribe = onSnapshot(
                transactionRef,
                snapshot => {
                    if (snapshot.exists()) {
                        observer.next({
                            ...snapshot.data(),
                            id: snapshot.id
                        } as Transaction);
                    } else {
                        observer.next(null);
                    }
                },
                error => observer.error(error)
            );
            return () => unsubscribe();
        });
    }

    //Service to get  transactions by type of a user from firestore db
    getTransactionsByType(uid: string, type: Transaction['type']): Observable<Transaction[]> {
        const q = query(this.getTransactionCollection(uid), where('type', '==', type), orderBy('transactionDate', 'desc'));
        return new Observable<Transaction[]>(observer => {
            const unsubscribe = onSnapshot(q,
                snapshot => {
                    const transactions = snapshot.docs.map(document => ({
                        ...document.data(),
                        id: document.id
                    })) as Transaction[];
                    observer.next(transactions);
                },
                error => observer.error(error)
            );
            return () => unsubscribe();
        });
    }

    //Service to create the new transaction
    async addTransaction(uid: string, transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
        const transactionData = {
            ...transaction,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };
        const documentRef = await addDoc(this.getTransactionCollection(uid), transactionData);
        return documentRef.id;
    }

    //Service to update the existing transaction
    updateTransaction(uid: string, transactionId: string, changes: Partial<Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
        const transactionRef = doc(firebaseStore, 'users', uid, 'transactions', transactionId);
        return updateDoc(transactionRef, {
            ...changes,
            updatedAt: serverTimestamp()
        });
    }

    //Service to delete a transaction
    deleteTransaction(uid: string, transactionId: string): Promise<void> {
        const transactionRef = doc( firebaseStore, 'users', uid, 'transactions', transactionId );
        return deleteDoc(transactionRef);
    }


}
