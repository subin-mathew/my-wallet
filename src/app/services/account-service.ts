import { Injectable, inject } from '@angular/core';
import { firebaseAuth, firebaseStore } from '../config/firebase.config';
import { Firestore, collection, addDoc, Timestamp, Transaction, onSnapshot } from 'firebase/firestore';
import { Account } from '../models/account';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AccountService {

    private readonly fireStore: Firestore = firebaseStore

    async addAccount(uid: string, account: Omit<Account, 'id'>): Promise<string> {
        const accountsRef = collection(firebaseStore, 'users', uid, 'accounts');
        const docRef = await addDoc(accountsRef, account);
        return docRef.id;
    }

    getAllUserAccounts(uid: string): Observable<Account[]>{
        const accountsRef = collection(firebaseStore, 'users', uid, 'accounts');
        return new Observable<Account[]>(observer => {
        const unsubscribe = onSnapshot(
          accountsRef,
          snapshot => {
            const accounts: Account[] = snapshot.docs.map(doc => ({
              ...doc.data(),
              id: doc.id
            })) as Account[];
    
            observer.next(accounts);
          },
          error => observer.error(error)
        );
    
        return () => unsubscribe();
      });
    }

   



    
}
