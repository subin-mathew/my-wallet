import { Injectable, inject } from '@angular/core';
import { firebaseAuth, firebaseStore } from '../config/firebase.config';
import { Firestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { Account } from '../models/account';

@Injectable({
    providedIn: 'root',
})
export class AccountService {

    private readonly fireStore: Firestore = firebaseStore

    async addAccount(uid: string, account: Omit<Account, 'id'>): Promise<string> {
        const accountsRef = collection(this.fireStore, 'users', uid, 'accounts');
        const docRef = await addDoc(accountsRef, account);
        return docRef.id;
    }
}
