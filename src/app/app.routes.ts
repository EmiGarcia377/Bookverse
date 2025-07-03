import { Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CreateReviewComponent } from './pages/create-review/create-review.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { EditReviewComponent } from './pages/edit-review/edit-review.component';

export const routes: Routes = [
    { path: '', component: MainComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'create-review', component: CreateReviewComponent },
    { path: 'profile/:userId', component: ProfileComponent },
    { path: 'edit-review/:reviewId', component: EditReviewComponent }
];
