import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BooksService } from '../../services/books.service';
import User from '../../../models/User';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-add-library-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './add-library-modal.component.html',
  styles: ``
})
export class AddLibraryModalComponent{
  @Output() closeModal = new EventEmitter<void>();

  libraryForm: FormGroup;
  libraryTitle: FormControl;
  libraryDesc: FormControl;

  isOpen = false;
  user: User = { userId: null, fullName: null, username: null };

  constructor(private booksService: BooksService, private userService: UserService) {
    this.libraryTitle = new FormControl('', [Validators.required, Validators.minLength(3)]);
    this.libraryDesc = new FormControl('');
    this.libraryForm = new FormGroup({
      name: this.libraryTitle,
      description: this.libraryDesc
    });
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    this.closeModal.emit();
  } 

  createLibrary(){
    this.user = this.userService.getCurrentUserData();
    if(!this.user.userId) return
    this.booksService.createLibrary(this.user.userId, this.libraryForm.value).subscribe({
      next: res => {
        alert(res.message);
        this.close();
      },
      error: err => {
        console.log(err);
        alert(err.error.nameErr);
      }
    });
  }
}
