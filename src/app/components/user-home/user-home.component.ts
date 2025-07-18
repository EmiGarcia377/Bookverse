import { Component, OnInit } from '@angular/core';
import User from '../../../models/User';
import Review from '../../../models/Review';
import { RoutesService } from '../../services/routes.service';
import { ReviewActionsService } from '../../services/review-actions.service';
import { ReviewsService } from '../../services/reviews.service';
import { UserService } from '../../services/user.service';

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
  recentSaved: Review[] = [];
  recentReviews: Review[] = [];
  menuToggle: number | null = null;
  constructor(
    public routesService: RoutesService,
    public reviewActionsService: ReviewActionsService,
    private reviewsService: ReviewsService,
    private userService: UserService
  ) {}
 ngOnInit(): void {
  this.user = this.userService.getCurrentUserData();
   this.reviewsService.getUserDashboard(this.user.userId).subscribe({
      next: res => {
        this.recentSaved = res.recentSavedReviews;
        this.recentReviews = res.recentUserReviews;
      },
      error: err => console.log(err)
    });
 }
}
