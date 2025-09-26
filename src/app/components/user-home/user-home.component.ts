import { Component, Input, OnInit } from '@angular/core';
import User from '../../../models/User';
import Review from '../../../models/Review';
import { RoutesService } from '../../services/routes.service';
import { ReviewActionsService } from '../../services/review-actions.service';
import { ReviewsService } from '../../services/reviews.service';
import { UserService } from '../../services/user.service';
import { SectionStateServiceService } from '../../services/section-state-service.service';
import { BooksService } from '../../services/books.service';

@Component({
  selector: 'app-user-home',
  imports: [],
  templateUrl: './user-home.component.html',
  styles: ``
})
export class UserHomeComponent implements OnInit {
  user: User = { userId: null, username: '', fullName: ''};
  error: string = '';
  message: string | undefined = '';
  books: any[] = [];
  recentSaved: Review[] = [];
  recentReviews: Review[] = [];
  menuToggle: number | null = null;
  constructor(
    public routesService: RoutesService,
    public reviewActionsService: ReviewActionsService,
    private reviewsService: ReviewsService,
    private userService: UserService,
    private sectionState: SectionStateServiceService,
    public booksService: BooksService
  ) {}
 ngOnInit(): void {
  this.userService.getUser().subscribe({
    next: res => {
      this.user.userId = res.userId;
      this.user.username = res.username;
      this.user.fullName = res.fullName;
      this.user.profilePic = res.profilePic;
      if(this.user.userId){
        this.booksService.getUserBooks(this.user.userId).subscribe({
          next: res => {
            this.books = res.books;
          },
          error: err => console.log(err)
        })
        this.reviewsService.getUserDashboard(this.user.userId).subscribe({
          next: res => {
            this.recentSaved = res.recentSavedReviews;
            this.recentReviews = res.recentUserReviews;
          },
          error: err => console.log(err)
        });
      } 
    }
  });
 }

 toggleMenu(index: number){
    this.menuToggle = this.reviewActionsService.toggleMenu(index, this.menuToggle);
  }

 setSection(section: string) {
    this.sectionState.setSection(section);
  }
}
