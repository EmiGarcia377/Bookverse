import { Component, EventEmitter, Output } from '@angular/core';
import { uuid } from '../../../models/User';
import { BooksService } from '../../services/books.service';

@Component({
  selector: 'app-library-modal',
  imports: [],
  templateUrl: './library-modal.component.html',
  styles: ``
})
export class LibraryModalComponent {
  @Output() closeModal = new EventEmitter<void>();
  library: any = {};

  userId: uuid | null = null;
  isOpen:boolean = false;
  libraryBooks: any[] = [];
  constructor(public booksService: BooksService) {}

  open(library: any, userId: uuid | null) {
    this.userId = userId;
    this.isOpen = true;
    this.library = library;
    if(this.userId && this.library.id){
      this.booksService.getLibraryBooks(this.userId, this.library.id).subscribe({
        next: res => this.libraryBooks = res.books,
        error: err => console.log(err)
      });
    }
  }

  close() {
    this.isOpen = false;
    this.closeModal.emit();
    this.library = {};
    this.libraryBooks = [];
  }
}
