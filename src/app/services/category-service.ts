import { Injectable } from '@angular/core';
import { addDoc, collection, doc, Firestore, FirestoreError, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { firebaseStore } from '../config/firebase.config';
import { Observable } from 'rxjs';
import { Category } from '../models/category';

@Injectable({
    providedIn: 'root',
})
export class CategoryService {
    
    private readonly categoriesRef = collection(firebaseStore, 'categories');

    // Get all categories 
    getCategories(): Observable<Category[]> {
        const q = query(this.categoriesRef, orderBy('name', 'asc'));
        return new Observable<Category[]>(observer => {
            const unsubscribe = onSnapshot(q,
                snapshot => {
                    const categories = snapshot.docs.map(document => ({
                        ...document.data(),
                        id: document.id
                    })) as Category[];
                    observer.next(categories);
                },
                (error: FirestoreError) => observer.error(error)
            );
            return () => unsubscribe();
        });
    }

    // Get categories by transaction type
    getCategoriesByType(type: Category['type']): Observable<Category[]> {
        const q = query(this.categoriesRef, where('type', '==', type), orderBy('name', 'asc'));

        return new Observable<Category[]>(observer => {
            const unsubscribe = onSnapshot(
                q,
                snapshot => {
                    const categories = snapshot.docs.map(document => ({
                        ...document.data(),
                        id: document.id
                    })) as Category[];

                    observer.next(categories);
                },
                error => observer.error(error)
            );
            return () => unsubscribe();
        });
    }

    // Add category
    async addCategory(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
        const ref = await addDoc(this.categoriesRef, {
            ...category,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return ref.id;
    }

    // Update category
    updateCategory(categoryId: string, changes: Partial<Omit<Category, 'id' | 'createdAt'>>): Promise<void> {
        const categoryRef = doc(firebaseStore, 'categories', categoryId);
        return updateDoc(categoryRef, {
            ...changes,
            updatedAt: serverTimestamp()
        });
    }

}
