import { Component, OnInit } from '@angular/core';
import { SectionStateServiceService } from '../../services/section-state-service.service';
import User from '../../../models/User';
import { QuotesService } from '../../services/quotes.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-book-quotes',
  imports: [],
  templateUrl: './user-book-quotes.component.html',
  styles: ``
})
export class UserBookQuotesComponent implements OnInit{
  booksQuotes: any[] = [];
  user: User = { userId: null, username: '', fullName: '' };

  constructor(
    private sectionState: SectionStateServiceService, 
    private quotesService: QuotesService,
    private userService: UserService
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
  
  setSection(section: string) {
    this.sectionState.setSection(section);
  }
}
