import { Component, TemplateRef, viewChild, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { DialogService } from '../../services/dialog.service';
import { RoutesService } from '../../services/routes.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent {
  loginForm: FormGroup;
  email: FormControl;
  password: FormControl;
  error: string = '';
  message: string = '';

  constructor(
    private userService: UserService, 
    private routesService: RoutesService, 
    private dialogService: DialogService
  ){
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.password = new FormControl('', [Validators.required, Validators.minLength(6)]);
    
    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password 
    });
  }
  
  resTemplate = viewChild(TemplateRef);
  resViewContainerRef = viewChild('template', {read: ViewContainerRef});

  onLogin(){
    this.userService.loginUser(this.loginForm.value).subscribe({
      next: res => {
        this.message = res?.message;
        this.error = '';
        this.dialogService.openDialog(this.resTemplate()!, this.resViewContainerRef()!);
        const storage = res?.rememberMe ? localStorage : sessionStorage;
        storage.setItem('user_id', res?.userId);
        if(res){
          this.routesService.goDashboard();
        }
        this.loginForm.reset();
      },
      error: err => {
        this.error = err.message || 'Error al iniciar sesion.';
        this.message = '';
        this.dialogService.openDialog(this.resTemplate()!, this.resViewContainerRef()!);
      }
    })
  }
}
