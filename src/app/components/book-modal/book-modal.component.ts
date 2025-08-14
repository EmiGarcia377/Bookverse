import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BooksService } from '../../services/books.service';

@Component({
  selector: 'app-book-modal',
  imports: [ FormsModule ],
  templateUrl: './book-modal.component.html',
  styles: ``
})
export class BookModalComponent{
  @Output() closeModal = new EventEmitter<void>();
  @Input() book: any = {};
  selectedBook: any = {};

  isOpen = false;
  originalActualPage: number | null = null;
  constructor(private booksService: BooksService) { }

  open() {
    this.isOpen = true;
    this.originalActualPage = this.book.actual_page;
  }

  updateActualPages() {
    if (this.book.actual_page < 1 || this.book.actual_page > this.book.num_pages) {
      alert(`La pagina actual debe estar entre 1 y ${this.book.num_pages}`);
      return;
    }

    if (this.book.actual_page === this.originalActualPage) {
      alert('El valor de la página actual no ha cambiado.');
      return;
    }

    this.booksService.updateActualPage(this.book.id, this.book.actual_page).subscribe({
      next: res => alert('Pagina actualizada correctamente'),
      error: err => console.log(err)
    });
  }

  close() {
    this.isOpen = false;
    this.closeModal.emit();
  }
}
