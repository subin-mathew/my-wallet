import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { ErrorMessages, SuccessMessages, ValidationMessages } from '../../utils/enums';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-user-registration',
  imports: [ReactiveFormsModule],
  templateUrl: './user-registration.html',
  styleUrl: './user-registration.css',
})
export class UserRegistration {

  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly route = inject(Router);
  readonly validationMessages = ValidationMessages;

  //Messages
  errorMessage = '';
  successMessage = '';

  //Password Visibility
  showPassword = false;
  showConfirmPassword = false;

  //Loading State
  isLoading = false;
  isGoogleLoading = false;

  //Registration Form
  registrationForm = this.formBuilder.nonNullable.group({
    fullName : [ '', [Validators.required, Validators.minLength(3)]],
    email : [ '', [Validators.required, Validators.email]],
    password : ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword : ['', [Validators.required]],
    termsAccepted : [ false, [Validators.requiredTrue]]
  });

  //Form Controls
  get fullName() {
    return this.registrationForm.controls.fullName;
  }

  get email() {
    return this.registrationForm.controls.email;
  }

  get password() {
    return this.registrationForm.controls.password;
  }

  get confirmPassword() {
    return this.registrationForm.controls.confirmPassword;
  }

  get termsAccepted() {
    return this.registrationForm.controls.termsAccepted;
  }

  //Register User Account
  async register() : Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';

    if(this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    if(this.password.value !== this.confirmPassword.value) {
      this.errorMessage = 'Password do not matched';
      return;
    }

    this.isLoading = true;

    try {
      const userProfile = await this.authService.userRegistration(this.fullName.value.trim(), this.email.value.trim(), this.password.value);
      this.successMessage = SuccessMessages.SIGN_UP;
      toast.success(this.successMessage);
      await this.route.navigate(['/login']);
    } catch (error) {
      this.errorMessage = ErrorMessages.SIGNUP_FAILED;
      toast.error(this.errorMessage);
    } finally {
      this.isLoading = false;
    }
  }

  //Sign Up with Google
  async registerWithGoogle() : Promise<void> {

    this.isGoogleLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    try {
        await this.authService.loginWithGoogle();
        this.successMessage = SuccessMessages.SIGN_UP;
        toast.success(this.successMessage);
    } catch (error) {
        this.errorMessage = ErrorMessages.SIGNUP_FAILED;
        toast.error(this.errorMessage);
    } finally {
        this.isGoogleLoading = false;
    }
   
  }

  gotoSignIn() {
    this.route.navigate(['/signin'])
  }
}
