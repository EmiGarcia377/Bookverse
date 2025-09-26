import { Component, OnInit, ViewChild } from '@angular/core';
import { SectionStateServiceService } from '../../services/section-state-service.service';
import { UserService } from '../../services/user.service';
import { BooksService } from '../../services/books.service';
import User from '../../../models/User';
import { BookModalComponent } from '../book-modal/book-modal.component';

@Component({
  selector: 'app-user-book-libraries',
  imports: [BookModalComponent],
  templateUrl: './user-book-libraries.component.html',
  styles: ``
})
export class UserBookLibrariesComponent implements OnInit{
  @ViewChild('bookModal') bookModal!: BookModalComponent;
  customLibraries: any[] = [];
  user: User = { userId: null, username: '', fullName: '' };

  constructor(
    private sectionState: SectionStateServiceService, 
    private userService: UserService,
    public booksService: BooksService,
  ) {}
  ngOnInit(): void {
    this.user = this.userService.getCurrentUserData();
    if(this.user.userId){
      this.booksService.getLibrariesWBooks(this.user.userId).subscribe({
        next: res => this.customLibraries = res.data,
        error: err => console.log(err)
      });
    }
  }

  setSection(section: string) {
    this.sectionState.setSection(section);
  }

  openBookModal(book: any) {
    this.bookModal.open(book);
  }

  closeBookModal(){
    this.bookModal.close();
  }
}
