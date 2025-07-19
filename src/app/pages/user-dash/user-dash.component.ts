import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import User from '../../../models/User';
import { UserService } from '../../services/user.service';
import { RoutesService } from '../../services/routes.service';
import { ReviewActionsService } from '../../services/review-actions.service';
import Review from '../../../models/Review';
import { UserHomeComponent } from "../../components/user-home/user-home.component";
import { UserReviewsComponent } from '../../components/user-reviews/user-reviews.component';
import { UserBookTrackerComponent } from '../../components/user-book-tracker/user-book-tracker.component';

@Component({
  selector: 'app-user-dash',
  imports: [RouterLink, UserHomeComponent, UserReviewsComponent, UserBookTrackerComponent],
  templateUrl: './user-dash.component.html',
  styles: ``
})
export class UserDashComponent implements OnInit{
  error: string = '';
  message: string | undefined = '';
  activeSection: string = 'home';
  user: User = { userId: null, username: '', fullName: ''};
  recentSaved: Review[] = [];
  recentReviews: Review[] = [];
  menuToggle: number | null = null;
  constructor(
    private userService: UserService, 
    public routesService: RoutesService,
    public reviewActionsService: ReviewActionsService
  ) {}
  ngOnInit(): void {
    this.userService.getUser().subscribe({
      next: res => {
        this.message = res.message
        this.user.userId = res.userId;
        this.user.username = res.username;
        this.user.fullName = res.fullName;
        this.user.profilePic = res.profilePic;
        this.userService.setCurrentUserData(this.user);
      },
      error: err => {
        this.error = err.message;
        console.log(err);
      }
    });

  }
}
