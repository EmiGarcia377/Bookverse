import { Routes } from '@angular/router';
import { SigninComponent } from './pages/signin/signin.component';
import { MainComponent } from './pages/main/main.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
    { path: '', component: MainComponent },
    { path: 'signin', component: SigninComponent },
    { path: 'login', component: LoginComponent },
    { path: 'dashboard/:userId', component: DashboardComponent }
];
