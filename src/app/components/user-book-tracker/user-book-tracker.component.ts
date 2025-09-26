import { Component, OnInit, ViewChild } from '@angular/core';
import { AddBookStatusModalComponent } from '../add-book-status-modal/add-book-status-modal.component';
import { SectionStateServiceService } from '../../services/section-state-service.service';
import { AddBookModalComponent } from '../add-book-modal/add-book-modal.component';
import { BooksService } from '../../services/books.service';
import User, { uuid } from '../../../models/User';
import { UserService } from '../../services/user.service';
import { BookModalComponent } from "../book-modal/book-modal.component";
import { AddLibraryModalComponent } from '../add-library-modal/add-library-modal.component';
import { QuotesService } from '../../services/quotes.service';
import { AddQuoteModalComponent } from '../add-quote-modal/add-quote-modal.component';
import { LibraryModalComponent } from '../library-modal/library-modal.component';
import { ReviewActionsService } from '../../services/review-actions.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-book-tracker',
  imports: [
    AddBookStatusModalComponent, 
    AddBookModalComponent, 
    BookModalComponent, 
    AddLibraryModalComponent, 
    AddQuoteModalComponent,
    LibraryModalComponent,
    FormsModule
  ],
  templateUrl: './user-book-tracker.component.html',
  styles: ``
})
export class UserBookTrackerComponent implements OnInit{
  @ViewChild('bookStatusModal') bookStatusModal!: AddBookModalComponent;
  @ViewChild('addBookModal') addBookModal!: AddBookModalComponent;
  @ViewChild('bookModal') bookModal!: BookModalComponent;
  @ViewChild('addLibraryModal') addLibraryModal!: AddLibraryModalComponent;
  @ViewChild('addQuoteModal') addQuoteModal!: AddQuoteModalComponent;
  @ViewChild('libraryModal') libraryModal!: LibraryModalComponent;

  books: any[] = [];
  readBooks: any[] = [];
  inProgressBooks: any[] = [];
  unreadBooks: any[] = [];
  libraries: any[] = [];
  quotes: any[] = [];

  user: User = { userId: null, username: '', fullName: ''};
  menuToggle: number | null = null;
  editIndex: number | null = null;
  editQuote = false;
  editedQuote: string = '';
  editedPage: number | null = null;
  bookStatus: 'Sin leer' | 'En progreso' | 'Leidos' = 'Sin leer';
  readonly activeToggleClass = 'px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition duration-300';
  readonly inactiveToggleClass = 'px-4 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300 transition duration-300';

  constructor(
    private sectionState: SectionStateServiceService,
    public booksService: BooksService,
    private userService: UserService,
    private quotesService: QuotesService,
    private reviewActionsService: ReviewActionsService
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getCurrentUserData();
    if(this.user.userId){
      this.booksService.getUserBooks(this.user.userId).subscribe({
        next: res => {
          this.books = res.books;
        },
        error: err => {
          console.log(err);
        }
      });

      this.booksService.getStatusSection(this.user.userId).subscribe({
        next: res => {
          this.readBooks = res.readBooks;
          this.inProgressBooks = res.readingBooks;
          this.unreadBooks = res.unreadBooks;
        },
        error: err => console.log(err)
      });

      this.booksService.getCustomLibraries(this.user.userId).subscribe({
        next: res => {
          this.libraries = res.libraries;
        },
        error: err => console.log(err)
      });

      this.quotesService.getQuotesSection(this.user.userId).subscribe({
        next: res => this.quotes = res.quotes,
        error: err => console.log(err)
      });
    }
  }

  toggleEdit(index: number){
    if(this.editQuote === true){
      this.editIndex = null;
      this.editQuote = !this.editQuote;
      this.menuToggle = null;
    } else{
      this.editIndex = index;
      this.editQuote = !this.editQuote;
      this.editedQuote = this.quotes[index].content;
      this.editedPage = this.quotes[index].num_page;
    }
  }

  submitEditedQuote(quoteId: uuid){
    if(this.user.userId && this.editIndex !== null && this.editedPage !== null && this.editedPage > 0){
      this.quotesService.updateQuote(quoteId, this.user.userId, this.editedQuote, this.editedPage).subscribe({
        next: res => {
          console.log(res)
          this.quotes[this.editIndex!].content = res.updatedQuote.content;
          this.quotes[this.editIndex!].num_page = res.updatedQuote.num_page;
          this.editQuote = false;
          this.editIndex = null;
          this.menuToggle = null;
        },
        error: err => console.log(err)
      });
    }
  }

  deleteQuote(quoteId: uuid){
    if(this.user.userId){
      this.quotesService.deleteQuote(this.user.userId, quoteId).subscribe({
        next: res => {
          alert(res.message);
          this.quotes = this.quotes.filter(quote => quote.id !== quoteId);
          this.menuToggle = null;
          this.editQuote = false;
          this.editIndex = null;
        },
        error: err => console.log(err)
      });
    }
  }

  openBookStatusModal(){
    this.bookStatusModal.open();
  }
  
  closeBookStatusModal(){
    this.bookStatusModal.close();
  }

  openNewBookModal(){
    this.addBookModal.open();
  }

  closeNewBookModal(){
    this.addBookModal.close();
  }

  openBookModal(book: any) {
    this.bookModal.open(book);
  }

  closeBookModal(){
    this.bookModal.close();
  }

  openAddLibraryModal(){
    this.addLibraryModal.open();
  }

  closeAddLibraryModal(){
    this.addLibraryModal.close();
    this.addLibraryModal.libraryForm.reset();
  }

  openAddQuoteModal(){
    this.addQuoteModal.open();
  }

  closeAddQuoteModal(){
    this.addQuoteModal.close();
  }

  openLibraryModal(library: any){
    this.libraryModal.open(library, this.user.userId);
  }

  closeLibraryModal(){
    this.libraryModal.close();
  }

  toggleMenu(index: number){
    this.menuToggle = this.reviewActionsService.toggleMenu(index, this.menuToggle);
  }

  setBookList(event: any){
    if(this.books.length == 4){
      this.books.pop();
      this.books.unshift(event);
    } else {
      this.books.unshift(event);
    }
  }

  addLibrary(library: any){
    if(this.libraries.length === 4){
      this.libraries.pop();
      this.libraries.unshift(library);
    } else {
      this.libraries.unshift(library);
    }
  }

  addQuote(quote: any){
    if(this.quotes.length === 3){
      this.quotes.pop();
      this.quotes.unshift(quote);
    } else {
      this.quotes.unshift(quote);
    }
  }

  switchBookStatus(newStatus: 'Sin leer' | 'En progreso' | 'Leidos' = 'Sin leer'){
    if(newStatus === 'Sin leer'){
      this.bookStatus = 'Sin leer';
    } else if(newStatus === 'En progreso'){
      this.bookStatus = 'En progreso';
    } else if(newStatus === 'Leidos'){
      this.bookStatus = 'Leidos';
    }
  }

  handleNewBook(book: any) {
    this.books.push(book);
    console.log("Nuevo libro agregado:", book);
  }

  setSection(section: string) {
    this.sectionState.setSection(section);
  }
}
