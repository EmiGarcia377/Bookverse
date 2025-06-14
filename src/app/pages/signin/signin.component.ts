import { Component } from '@angular/core';
import { Form, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

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

  constructor(){
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

  signin(): void{
    console.log(this.signinForm.value)
  }
}
