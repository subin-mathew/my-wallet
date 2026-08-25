import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { ForgotPassword } from './components/forgot-password/forgot-password';
import { UserRegistration } from './components/user-registration/user-registration';

export const routes: Routes = [
    { path: '', redirectTo: 'signin', pathMatch: 'full' },
    { path: 'signin', component: Login },
    { path: 'forgot-password', component: ForgotPassword },
    { path: 'signup', component: UserRegistration }
];
