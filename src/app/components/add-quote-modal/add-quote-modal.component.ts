import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { uuid } from '../../../models/User';
import { UserService } from '../../services/user.service';
import { BooksService } from '../../services/books.service';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuotesService } from '../../services/quotes.service';

@Component({
  selector: 'app-add-quote-modal',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './add-quote-modal.component.html',
  styles: ``
})
export class AddQuoteModalComponent implements OnInit{
  @Output() closeModal = new EventEmitter<void>();
  @Output() createdQuote = new EventEmitter<void>();
  isOpen = false;
  userId: uuid | null = null;
  userBooks: any[] = [];
  selectedBook: any = null;
  quoteInput: FormControl;
  editedPage: number | null = null;

  constructor(
    private userService: UserService,
    private booksService: BooksService,
    private quotesService: QuotesService
  ) { this.quoteInput = new FormControl('', [Validators.required, Validators.minLength(10)])}

  ngOnInit(): void {
    this.userId = this.userService.getCurrentUserData().userId;
    if(this.userId){
      this.booksService.getBooksWAuthors(this.userId).subscribe({
        next: res => this.userBooks = res.data,
        error: err => console.log(err)
      });
    }
  }

  onBookChange(event: Event){
    const selectedElement = event.target as HTMLSelectElement;
    const bookId = selectedElement.value;
    this.selectedBook = this.userBooks.find(book => book.id === bookId);
  }

  submitQuote(){
    if(this.userId && this.selectedBook && this.quoteInput.valid && this.editedPage !== null && this.editedPage > 0){
      this.quotesService.createQuote(this.userId, this.selectedBook.id, this.quoteInput.value, this.editedPage).subscribe({
        next: res => {
          alert("Cita agregada con exito");
          const quote: any = { content: this.quoteInput.value, books: { title: this.selectedBook.title, authors: this.selectedBook.authors }};
          this.createdQuote.emit(quote)
          this.quoteInput.reset();
          this.close();
        },
        error: err => console.log(err)
      });
    }
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    this.selectedBook = null;
    this.closeModal.emit();
  } 
}
