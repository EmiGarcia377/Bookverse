import { Routes } from '@angular/router';
import { SigninComponent } from './pages/signin/signin.component';
import { MainComponent } from './pages/main/main.component';

export const routes: Routes = [
    { path: '', component: MainComponent},
    { path: 'signin', component: SigninComponent}
];
