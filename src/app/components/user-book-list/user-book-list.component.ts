import { Component, OnInit, ViewChild } from '@angular/core';
import { SectionStateServiceService } from '../../services/section-state-service.service';
import { AddBookModalComponent } from '../add-book-modal/add-book-modal.component';
import User from '../../../models/User';
import { UserService } from '../../services/user.service';
import { BooksService } from '../../services/books.service';
import { BookModalComponent } from "../book-modal/book-modal.component";

@Component({
  selector: 'app-user-book-list',
  imports: [AddBookModalComponent, BookModalComponent],
  templateUrl: './user-book-list.component.html',
  styles: ``
})
export class UserBookListComponent implements OnInit{
  @ViewChild('addBookModal') addBookModal!: AddBookModalComponent;
  @ViewChild('bookModal') bookModal!: BookModalComponent;
  allBooks: any[] = [];
  progresBooks: any[] = [];
  completedBooks: any[] = [];
  unreadBooks: any[] = [];
  user: User = { userId: null, username: '', fullName: ''};

  constructor(
    private sectionState: SectionStateServiceService,
    private userService: UserService,
    private booksService: BooksService
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getCurrentUserData();
    if(this.user.userId){
      this.booksService.getUserBooks(this.user.userId).subscribe({
        next: res => {
          this.allBooks = res.books
          this.loadProgress();
        },
        error: err => console.log(err)
      });
      
    }
  }

  loadProgress(){
    for(const book of this.allBooks){
      if(book.status === "Leido") this.completedBooks.push(book);
      else if(book.status === "En progreso") this.progresBooks.push(book);
      else if(book.status === "Sin leer") this.unreadBooks.push(book);
    }
  }

  openBookModal(book: any) {
    this.bookModal.open(book);
  }

  closeBookModal(){
    this.bookModal.close();
  }

  setBookList(event: any){
    this.allBooks.push(event);
  }

  setSection(section: string) {
    this.sectionState.setSection(section);
  }

  openNewBookModal(){
    this.addBookModal.open();
  }
  
  closeNewBookModal(){
    this.addBookModal.close();
  }
}
