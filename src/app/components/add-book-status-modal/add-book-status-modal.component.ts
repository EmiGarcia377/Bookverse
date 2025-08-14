import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BooksService } from '../../services/books.service';

@Component({
  selector: 'app-add-book-status-modal',
  imports: [FormsModule],
  templateUrl: './add-book-status-modal.component.html',
  styles: ``
})
export class AddBookStatusModalComponent implements OnChanges{
  @Output() closeModal = new EventEmitter<void>();
  @Output() addBook = new EventEmitter<any>();
  @Input() books: any[] = [];
  allBooks: any[] = [];
  selectedBook: string = '';
  status: string = '';
  actualStatus: any = '';
  isOpen = false;

  constructor(private booksService: BooksService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['books']) {
      this.allBooks = this.books;
    }
  }
  
  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    this.closeModal.emit();
  }

  updateStatus() {
    this.actualStatus = this.allBooks.find((book) => book.id === this.selectedBook);

    if(this.status == '' || this.selectedBook == ''){
      alert("Selecciona un libro y el status a actualizar");
    } else if(this.actualStatus.status === this.status){
      alert("El libro seleccionado ya tiene el status seleccionado, selecciona uno diferente");
    } else{
      this.booksService.updateStatus(this.selectedBook, this.status).subscribe({
        next: res => {
          alert(res.message);
          this.close();
        },
        error: err => console.log(err)
      });
    }
  }
}
