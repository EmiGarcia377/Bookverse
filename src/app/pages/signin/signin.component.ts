import { Component, TemplateRef, viewChild, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { DialogService } from '../../services/dialog.service';

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
  rememberMe: FormControl
  error: string = '';
  message: string = '';


  constructor(private userService: UserService, private dialogService: DialogService){
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.password = new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern(/[a-zA-Z]+\d+/i)])
    this.username = new FormControl('', [Validators.required, Validators.minLength(3), Validators.max(25)])
    this.rememberMe = new FormControl(false)
    
    this.signinForm = new FormGroup({
      email: this.email,
      password: this.password,
      username: this.username,
      rememberMe: this.rememberMe 
    });
  }
  
  resTemplate = viewChild(TemplateRef);
  resViewContainerRef = viewChild('template', {read: ViewContainerRef});

  onRegister(){ 
    this.userService.registerUser(this.signinForm.value).subscribe({
      next: res => {
        this.message = res?.message;
        this.error = '';
        this.dialogService.openDialog(this.resTemplate()!, this.resViewContainerRef()!);
        this.signinForm.reset();
      },
      error: err => {
        this.error = err.message || 'Error al registrar el usuario.';
        this.message = '';
        this.dialogService.openDialog(this.resTemplate()!, this.resViewContainerRef()!);
      }
    })
  }
}
