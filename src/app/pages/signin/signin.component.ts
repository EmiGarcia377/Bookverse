import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import User from '../../../models/User';

@Component({
  selector: 'app-signin',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './signin.component.html',
  styles: ``
})
export class SigninComponent {
  signinForm: FormGroup;
  email: FormControl;
  password: FormControl;
  username: FormControl;
  rememberMe: FormControl;
  error: string = '';
  message: string = '';

  constructor(private userService: UserService){
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.password = new FormControl('', [Validators.required, Validators.minLength(8)])
    this.username = new FormControl('', [Validators.required, Validators.minLength(3)])
    this.rememberMe = new FormControl(false)
    
    this.signinForm = new FormGroup({
      email: this.email,
      password: this.password,
      username: this.username,
      rememberMe: this.rememberMe  
    })
  }

  onSubmit(){ 
    if(this.signinForm.valid){
      this.userService.registerUser(this.signinForm.value).subscribe({
        next: res => {
          this.message = 'Verifique su correo electronico.';
          
          const storage = this.rememberMe ? localStorage : sessionStorage;
          if ((res as any).session?.access_token) {
            storage.setItem('token', (res as any).session.access_token);
          }
          this.signinForm.reset();
        },
        error: err => {
          this.error = 'Error al registrar el usuario. Por favor, inténtelo de nuevo.';
          this.message = '';
          console.error(err);
        }
      })
    }
  }
}
