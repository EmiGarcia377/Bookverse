import { Component, OnInit } from '@angular/core';
import User from '../../../models/User';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-config',
  imports: [FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './user-config.component.html',
  styles: ``
})
export class UserConfigComponent implements OnInit{
  emailEditable: boolean = false;
  previewImage: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  user: User = { userId: null, username: null, fullName: null, biography: '', email: '' };
  userInfoForm: FormGroup;
  fullNameInput: FormControl;
  usernameInput: FormControl;
  biographyInput: FormControl;
  emailInput: FormControl;
  passwordInput: FormControl;

  constructor(private userService: UserService) {
    this.fullNameInput = new FormControl('', [Validators.required, Validators.minLength(3), Validators.max(25)]);
    this.usernameInput = new FormControl('', [Validators.min(3), Validators.max(15)]);
    this.biographyInput = new FormControl('', [Validators.minLength(10), Validators.maxLength(100)]);
    this.emailInput = new FormControl('', [Validators.required, Validators.email]);
    this.passwordInput = new FormControl('')

    this.userInfoForm = new FormGroup({
      email: this.emailInput,
      password: this.passwordInput,
      fullName: this.fullNameInput,
      username: this.usernameInput,
      biography: this.biographyInput
    });
  }
  ngOnInit(): void {
    this.userService.getUser().subscribe({
      next: res => {
        this.user = res;
        this.emailInput.setValue(this.user.email);
        this.emailInput.disable();
        this.fullNameInput.setValue(this.user.fullName);
        this.usernameInput.setValue(this.user.username);
        this.biographyInput.setValue(this.user.biography);
      }
    });
  }

  updateUser(){
    const formValue = this.userInfoForm.getRawValue();
    const hasChanged =
      formValue.email !== this.user.email ||
      formValue.fullName !== this.user.fullName ||
      formValue.username !== this.user.username ||
      formValue.biography !== this.user.biography || formValue.password !== '';
    
      if (!hasChanged) {
      alert('No hay cambios para actualizar.');
      return;
    }

    if (formValue.password !== '') {
      const confirmed = confirm('¿Estás seguro de que quieres cambiar tu contraseña?');
      if (!confirmed) {
        this.passwordInput.setValue('');
        return;
      }
    }

    this.userService.updateUser(formValue, this.user.userId).subscribe({
      next: res => {
        alert("Usuario actualizado correctamente!")
        this.user.fullName = res[0].full_name;
        this.user.email = res[0].email;
        this.user.username = res[0].username;
        this.user.biography = res[0].biography;
        this.user.profilePic = res[0].profilePic;
        this.emailInput.setValue(this.user.email);
        this.emailInput.disable();
        this.fullNameInput.setValue(this.user.fullName);
        this.usernameInput.setValue(this.user.username);
        this.biographyInput.setValue(this.user.biography);
      },
      error: err => {
        console.log(err);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.previewImage = reader.result;
    };
    reader.readAsDataURL(file);

    // Llama al servicio
    this.userService.updatepfp(file, this.user.userId).subscribe({
      next: (res) => {
        alert('Foto subida con éxito')
        this.user.profilePic = res;
      },
      error: (err) => {
        console.error('Error al subir la imagen', err);
      }
    });
  }

  toggleEmail(){
    this.emailEditable = !this.emailEditable
    if (this.emailEditable) {
      this.emailInput.enable();
    } else {
      this.emailInput.disable();
      this.emailInput.setValue(this.user.email);
    }
  }
}
