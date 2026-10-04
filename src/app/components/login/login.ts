import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { ErrorMessages, SuccessMessages, ValidationMessages } from '../../utils/enums';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  //Component State
  protected readonly isLoading = signal(false);
  protected readonly isGoogleLoading = signal(false);
  readonly validationMessages = ValidationMessages;
  protected showPassword = false;
  protected errorMessage = '';
  protected successMessage = '';

  //Login Form
  protected readonly loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  //Form Controls
  protected get emailControl() {
    return this.loginForm.controls.email;
  }

  protected get passwordControl() {
    return this.loginForm.controls.password;
  }

  //Toggle Password
  protected togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  //Email & Password Login
  protected async login(): Promise<void> {

    //Clear Previous Error Messages
    this.errorMessage = '';
    this.successMessage = '';

    //Validate the Form
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const { email, password } = this.loginForm.getRawValue();

    try {
      const firebaseUser = await this.authService.loginWithEmail(email, password);
      const userProfile = await this.authService.getUserProfile(firebaseUser.uid);
      if (!userProfile) {
        this.errorMessage = ErrorMessages.PROFILE_NOT_FOUND;
        toast.error(this.errorMessage);
        return;
      }
      this.successMessage = SuccessMessages.SIGN_IN;
      toast.success(this.successMessage);
      
      if (userProfile.isProfileCompleted) {
        await this.router.navigate(['/home']);
      } else {
        await this.router.navigate(['/onboarding']);
      }
    } catch (error: unknown) {
      this.errorMessage = this.getFirebaseErrorMessage(error);
      toast.error(this.errorMessage);
    } finally {
      this.isLoading.set(false);
    }
  }

  //Google Sign In Code
  async loginWithGoogle(): Promise<void> {

    this.isGoogleLoading.set(true);
    //Clear Previous Error Messages
    this.errorMessage = '';
    this.successMessage = '';

    try {

      const firebaseUser = await this.authService.loginWithGoogle();
      const userProfile = await this.authService.getUserProfile(firebaseUser.uid);
      if (!userProfile) {
        this.errorMessage = ErrorMessages.PROFILE_NOT_FOUND;
        toast.error(this.errorMessage);
        return;
      }
      this.successMessage = SuccessMessages.SIGN_IN;
      toast.success(this.successMessage);
      if (userProfile.isProfileCompleted) {
        await this.router.navigate(['/home']);
      } else {
        await this.router.navigate(['/onboarding']);
      }
    } catch (error: unknown) {
      this.errorMessage = this.getFirebaseErrorMessage(error);
      toast.error(this.errorMessage);
    } finally {
      this.isGoogleLoading.set(false);
    }
  }

  //Forgot Password Page Navigation
  protected forgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }

  //Create Account Page Navigation
  protected createAccount(): void {
    this.router.navigate(['/signup']);
  }

  private getFirebaseErrorMessage(error: unknown): string {
    const firebaseError = error as { code?: string; };
    switch (firebaseError.code) {

      case 'auth/invalid-credential':
        return 'Incorrect email or password. Please try again.';

      case 'auth/user-not-found':
        return 'No account found with this email address.';

      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';

      case 'auth/invalid-email':
        return 'Please enter a valid email address.';

      case 'auth/user-disabled':
        return 'This account has been disabled.';

      case 'auth/popup-closed-by-user':
        return 'Google sign-in was cancelled.';

      case 'auth/popup-blocked':
        return 'Please allow popups to sign in with Google.';

      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';

      default:
        return 'Unable to sign in. Please try again.';
    }
  }

}
