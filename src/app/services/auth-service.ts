import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signInWithPopup, User, GoogleAuthProvider, sendPasswordResetEmail } from 'firebase/auth';

import { firebaseAuth } from '../config/firebase.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly auth: Auth = firebaseAuth;

  //Email and Password Login
  async loginWithEmail(email:string, password:string): Promise<User>{
    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    return credential.user;
  }

  //Google Sign In
  async loginWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(this.auth, provider);
    return credential.user;
  }

  //Send Password Reset Link
  async forgotPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(firebaseAuth,email);
  }
}
