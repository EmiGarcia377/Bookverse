import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import User from '../../../models/User';
import { UserService } from '../../services/user.service';
import { ReviewsService } from '../../services/reviews.service';
import { RoutesService } from '../../services/routes.service';
import { ReviewActionsService } from '../../services/review-actions.service';

@Component({
  selector: 'app-user-dash',
  imports: [ RouterLink ],
  templateUrl: './user-dash.component.html',
  styles: ``
})
export class UserDashComponent implements OnInit{
  error: string = '';
  message: string | undefined = '';
  user: User = { userId: null, username: '', fullName: ''};
  recentSaved: any[] = [];
  recentReviews: any[] = [];
  menuToggle: number | null = null;
  constructor(
    private userService: UserService, 
    private reviewsService: ReviewsService,
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
        this.reviewsService.getUserDashboard(this.user.userId).subscribe({
          next: res => {
            this.recentSaved = res.recentSavedReviews;
            this.recentReviews = res.recentUserReviews;
          },
          error: err => console.log(err)
        });
      },
      error: err => {
        this.error = err.message;
        console.log(err);
      }
    });

  }
}
