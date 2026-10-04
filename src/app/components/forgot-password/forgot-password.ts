import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorMessages, SuccessMessages, ValidationMessages } from '../../utils/enums';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-forgot-password',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {

  //Component State
  protected readonly isLoading = signal(false);
  readonly validationMessages = ValidationMessages;
  email = '';
  successMessage = '';
  errorMessage = '';

  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  //Reset Password Form
  protected readonly passwordResetForm = this.formBuilder.nonNullable.group({
    email: ['', [ Validators.required, Validators.email]],
  });

  //Form Controls
  protected get emailControl() {
    return this.passwordResetForm.controls.email;
  }
  
  protected async resetPassword(): Promise<void> {
    //Clear Previous Message
    this.successMessage = '';
    this.errorMessage = '';

    //Validate the Form
    if(this.passwordResetForm.invalid){
      this.passwordResetForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const { email } = this.passwordResetForm.getRawValue();
    try {
      await this.authService.forgotPassword(email);
      this.successMessage = SuccessMessages.PASSWORD_RESET_LINK;
      toast.success(this.successMessage);
    } catch(error: unknown) {
      this.errorMessage = ErrorMessages.PASSWORD_RESET_LINK_FAILED;
      toast.error(this.errorMessage)
    } finally{
      this.isLoading.set(false);
    }
  }

  protected backToSignin(){
    this.router.navigate(['/login']);
  }

}
