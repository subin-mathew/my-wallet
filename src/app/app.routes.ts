import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { ForgotPassword } from './components/forgot-password/forgot-password';
import { UserRegistration } from './components/user-registration/user-registration';
import { Onboarding } from './components/onboarding/onboarding';
import { Home } from './components/home/home';
import { Dashboard } from './components/dashboard/dashboard';
import { Transactions } from './components/transactions/transactions';
import { Accounts } from './components/accounts/accounts';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'forgot-password', component: ForgotPassword },
    { path: 'signup', component: UserRegistration },
    { path: 'onboarding', component: Onboarding },
    { path: 'home', component: Home,
        children:[
            {path:'', redirectTo:'dashboard', pathMatch:'full'},
            {path:'dashboard', component: Dashboard},
            {path:'transactions', component: Transactions},
            {path:'accounts', component:Accounts}
        ]
    },
];
