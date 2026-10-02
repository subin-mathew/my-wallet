import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { ForgotPassword } from './components/forgot-password/forgot-password';
import { UserRegistration } from './components/user-registration/user-registration';
import { Onboarding } from './components/onboarding/onboarding';
import { Home } from './components/home/home';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'forgot-password', component: ForgotPassword },
    { path: 'signup', component: UserRegistration },
    { path: 'onboarding', component: Onboarding },
    { path: 'home', component: Home },
];
