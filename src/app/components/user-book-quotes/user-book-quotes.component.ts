import { Component, OnInit } from '@angular/core';
import { SectionStateServiceService } from '../../services/section-state-service.service';
import User, { uuid } from '../../../models/User';
import { QuotesService } from '../../services/quotes.service';
import { UserService } from '../../services/user.service';
import { ReviewActionsService } from '../../services/review-actions.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-book-quotes',
  imports: [FormsModule],
  templateUrl: './user-book-quotes.component.html',
  styles: ``
})
export class UserBookQuotesComponent implements OnInit{
  booksQuotes: any[] = [];
  user: User = { userId: null, username: '', fullName: '' };
  menuToggle: number | null = null;
  editIndex: number | null = null;
  editQuote = false;
  editedQuote: string = '';
  editedPage: number | null = null;

  constructor(
    private sectionState: SectionStateServiceService, 
    private quotesService: QuotesService,
    private userService: UserService,
    private reviewActionsService: ReviewActionsService
  ) { }

  ngOnInit(): void {
    this.user = this.userService.getCurrentUserData();
    if(this.user.userId){
      this.quotesService.getAllQuotes(this.user.userId).subscribe({
        next: res => this.booksQuotes = res.data,
        error: err => console.log(err)        
      });
    }
  }

  toggleMenu(index: number){
    this.menuToggle = this.reviewActionsService.toggleMenu(index, this.menuToggle);
  }

  toggleEdit(index: number, quoteId: uuid){
    if(this.editQuote === true){
      this.editIndex = null; 
      this.editQuote = !this.editQuote;
      this.menuToggle = null;
    } else{
      const bookIndex = this.booksQuotes.findIndex(book => book.quotes.some((quote: any) => quote.id === quoteId));
      this.editIndex = index;
      this.editQuote = !this.editQuote;
      this.editedQuote = this.booksQuotes[bookIndex].quotes[index].content;
      this.editedPage = this.booksQuotes[bookIndex].quotes[index].num_page;
    }
  }

  submitEditedQuote(quoteId: uuid){
    const bookIndex = this.booksQuotes.findIndex(book => book.quotes.some((quote: any) => quote.id === quoteId));
    if(this.user.userId && this.editIndex !== null && this.editIndex !== null && this.editedPage !== null && this.editedPage > 0){
      this.quotesService.updateQuote(quoteId, this.user.userId, this.editedQuote, this.editedPage).subscribe({
        next: res => {
          this.booksQuotes[bookIndex].quotes[this.editIndex!] = res.updatedQuote;
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
          this.booksQuotes = this.booksQuotes.filter(quote => quote.id !== quoteId);
          this.menuToggle = null;
          this.editQuote = false;
          this.editIndex = null;
        },
        error: err => console.log(err)
      });
    }
  }
  
  setSection(section: string) {
    this.sectionState.setSection(section);
  }
}
