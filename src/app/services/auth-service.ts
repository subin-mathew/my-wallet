import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signInWithPopup, User, GoogleAuthProvider, sendPasswordResetEmail, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

import { firebaseAuth, firebaseStore } from '../config/firebase.config';
import { email } from '@angular/forms/signals';
import { UserProfile } from '../models/user-profile';
import { doc, Firestore, getDoc, setDoc, Timestamp, updateDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly auth: Auth = firebaseAuth;
  private readonly fireStore: Firestore = firebaseStore


  //Email and Password Login
  async loginWithEmail(email: string, password: string): Promise<User> {
    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    // Update login information after successful authentication
    await this.updateLoginTimestamps(credential.user.uid);
    return credential.user;
  }

  //Google Sign In
  async loginWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(this.auth, provider);
    const firebaseUser = credential.user;

    const userProfileRef = doc(this.fireStore, 'users', firebaseUser.uid);

    //Check the Users is exist or not in Fire Store
    const existingUserProfile = await getDoc(userProfileRef);
    console.log(existingUserProfile);

    const now = Timestamp.now();

    if (!existingUserProfile.exists()) {

      const userProfile: UserProfile = {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName ?? '',
        email: firebaseUser.email ?? '',
        role: 'USER',
        provider: 'GOOGLE',
        status: 'ACTIVE',
        currency: '',
        country: '',
        isProfileCompleted: false,
        lastLoginAt: now,
        createdAt: now,
        updatedAt: now
      }
      await setDoc(userProfileRef, userProfile);
    } else {
      console.log("User Already Present")
      await this.updateLoginTimestamps(firebaseUser.uid);
    }
    return credential.user;
  }

  //Send Password Reset Link
  async forgotPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(firebaseAuth, email);
  }

  //User Registration
  async userRegistration(name: string, email: string, password: string): Promise<User> {

    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    const firebaseUser = credential.user;
    const now = Timestamp.now();

    //Update Firebase Display Name
    await updateProfile(firebaseUser, {
      displayName: name
    });

    const userProfile: UserProfile = {
      uid: firebaseUser.uid,
      name: name,
      email: email,
      role: 'USER',
      provider: 'PASSWORD',
      status: 'ACTIVE',
      currency: '',
      country: '',
      isProfileCompleted: false,
      lastLoginAt: null,
      createdAt: now,
      updatedAt: now
    }

    await setDoc(
      doc(this.fireStore, 'users', firebaseUser.uid), userProfile
    )
    return firebaseUser;
  }

  //Get User Profile
  async getUserProfile(uid: string): Promise<UserProfile | null> {

    const userProfileRef = doc(this.fireStore, 'users', uid);
    const userProfileSnapshot = await getDoc(userProfileRef);

    if (!userProfileSnapshot.exists()) {
      return null;
    }

    return userProfileSnapshot.data() as UserProfile;
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  private async updateLoginTimestamps(uid: string): Promise<void> {
    const now = Timestamp.now();
    const userProfileRef = doc(this.fireStore, 'users', uid);
    await updateDoc(userProfileRef, { lastLoginAt: now, updatedAt: now });
  }

  async updateCurrencies(uid: string, currency: string, country: string): Promise<void> {
    const now = Timestamp.now();
    const userProfileRef = doc(this.fireStore, 'users', uid);
    await updateDoc(userProfileRef, { updatedAt: now, currency: currency, country: country });
  }

  async updateProfileCompleteFlag(
    uid: string,
    isProfileComplete: boolean
  ): Promise<boolean> {

    try {
      const now = Timestamp.now();
      const userProfileRef = doc(this.fireStore, 'users', uid);

      await updateDoc(userProfileRef, {
        updatedAt: now,
        isProfileCompleted: isProfileComplete
      });

      return true;

    } catch (error) {
      console.error('Error updating profile completion status:', error);
      return false;
    }
  }

}
