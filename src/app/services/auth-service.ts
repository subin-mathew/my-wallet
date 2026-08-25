import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signInWithPopup, User, GoogleAuthProvider, sendPasswordResetEmail, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

import { firebaseAuth, firebaseStore } from '../config/firebase.config';
import { email } from '@angular/forms/signals';
import { UserProfile } from '../models/user-profile';
import { doc, Firestore, getDoc, setDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly auth: Auth = firebaseAuth;
  private readonly fireStore: Firestore = firebaseStore

  //Email and Password Login
  async loginWithEmail(email:string, password:string): Promise<User>{
    const credential = await signInWithEmailAndPassword(this.auth, email, password);
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

    const userProfile: UserProfile = {
      uid : firebaseUser.uid, 
      name : firebaseUser.displayName ?? '',
      email : firebaseUser.email ?? '',
      role : 'USER',
      provider : 'GOOGLE',
      isProfileCompleted : false,
      isLogined : true,
      accountStatus : 'ACTIVE'
    }

    if(!existingUserProfile.exists()) {
      await setDoc(userProfileRef,userProfile);
    } else {
      console.log("User Already Present")
    }
    return credential.user;
  }

  //Send Password Reset Link
  async forgotPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(firebaseAuth,email);
  }

  //User Registration
  async userRegistration(name: string, email: string, password: string): Promise<User> {

    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    const firebaseUser = credential.user;

    //Update Firebase Display Name
    await updateProfile(firebaseUser, {
      displayName: name
    });

    const userProfile: UserProfile = {
      uid : firebaseUser.uid, 
      name : name,
      email : email,
      role : 'USER',
      provider : 'PASSWORD',
      isProfileCompleted : false,
      isLogined : false,
      accountStatus : 'ACTIVE'
    }

    await setDoc(
      doc(this.fireStore, 'users', firebaseUser.uid), userProfile
    )
    return firebaseUser;
  }
}
