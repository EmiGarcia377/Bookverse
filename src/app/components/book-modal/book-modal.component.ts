import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BooksService } from '../../services/books.service';
import { UserService } from '../../services/user.service';
import { uuid } from '../../../models/User';
import { QuotesService } from '../../services/quotes.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-book-modal',
  imports: [ FormsModule, ReactiveFormsModule ],
  templateUrl: './book-modal.component.html',
  styles: ``
})
export class BookModalComponent implements OnInit{
  @Output() closeModal = new EventEmitter<void>();
  book: any = {};
  bookLibraries: any[] = [];
  libraries: any[] = [];
  bookQuotes: any[] = [];

  userId: uuid | null = null;
  isOpen: boolean = false;
  changeLibrary: boolean = false;
  originalActualPage: number | null = null;
  isQuotesOpen = false;
  isSummaryOpen = false;
  showFloatingTitle = false;
  createNewQuote = false;
  @ViewChild('autoTextarea') textarea!: ElementRef<HTMLTextAreaElement>;

  quoteInput: FormControl;
  summaryControl: FormControl = new FormControl('');

  constructor(
    private booksService: BooksService, 
    private userService: UserService,
    private quotesService: QuotesService
  ) { 
    this.quoteInput = new FormControl('', [Validators.required, Validators.minLength(10)]);
  }

  ngOnInit(): void {
    this.summaryControl.valueChanges
    .pipe(
      debounceTime(800),
      distinctUntilChanged()
    )
    .subscribe(value => this.updateSummary(value));
  }

  open(book: any) {
    this.userId = this.userService.getCurrentUserData().userId;
    this.isOpen = true;
    this.book = book;
    this.originalActualPage = book.actual_page;
    this.booksService.getBookLibraries(book.id).subscribe({
      next: res =>this.bookLibraries = res.libraries,
      error: err => console.log(err)
    });
    if(this.userId){
      this.booksService.getCustomLibraries(this.userId).subscribe({
        next: res => this.libraries = res.libraries,
        error: err => console.log(err)
      });
    }
    
  }

  onScroll(event: Event){
    const target = event.target as HTMLElement;
    const scrollTop = target.scrollTop;

    this.showFloatingTitle = scrollTop > 100;
  }

  toggleQuotes(){
    if(!this.userId) return
    if(this.bookQuotes.length === 0 && this.isQuotesOpen === false){
      this.quotesService.getBookQuotes(this.book.id).subscribe({
        next: res => this.bookQuotes = res.quotes,
        error: err => console.log(err)
      });
      this.isQuotesOpen = !this.isQuotesOpen;
    } else if(this.bookQuotes.length !== 0 && this.isQuotesOpen === false){
      this.isQuotesOpen = !this.isQuotesOpen;
    } else {
      this.isQuotesOpen = !this.isQuotesOpen;
    }
  }

  updateSummary(summary: string){
    this.booksService.updateBookSummary(this.book.id, summary).subscribe({
      next: res => console.log(res),
      error: err => console.log(err)
    });
  }

  toggleResume(){
    if(!this.book.summary && this.isSummaryOpen === false){
      this.booksService.getBookSummary(this.book.id).subscribe({
        next: res => this.book.summary = res.summary,
        error: err => console.log(err)
      });
      this.isSummaryOpen = !this.isSummaryOpen;
    } else if(this.book.summary && this.isSummaryOpen === false){
      this.isSummaryOpen = !this.isSummaryOpen;
    } else {
      this.isSummaryOpen = !this.isSummaryOpen;
    }
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
      error: err => console.log(err)
    });
  }

  addbookToLib(libraryId: uuid){
    this.booksService.addBookToLib(this.book.id, libraryId).subscribe({
      next: res => {
        this.bookLibraries.unshift(res.library);
        this.changeLibrary = false;
      },
      error: err => console.log(err)
    });
  }

  submitQuote(){
    if(this.userId){
      this.quotesService.createQuote(this.userId, this.book.id, this.quoteInput.value).subscribe({
        next: res => {
          this.bookQuotes.push(res.quote);
          this.createNewQuote = false;
          this.quoteInput.reset();
        },
        error: err => console.log(err)
      });
    }
  }

  ajustarAltura(){
    const el = this.textarea.nativeElement;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }

  close() {
    this.isOpen = false;
    this.changeLibrary = false;
    this.closeModal.emit();
    this.book = {};
    this.book.summary = '';
    this.bookLibraries = [];
    this.bookQuotes = [];
    this.showFloatingTitle = false;
    this.createNewQuote = false;
  }

  openLibraryModal(){
    this.changeLibrary = true;
  }
}
