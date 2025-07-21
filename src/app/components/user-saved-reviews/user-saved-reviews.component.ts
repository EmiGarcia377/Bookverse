import { Component, OnInit } from '@angular/core';
import User from '../../../models/User';
import Review from '../../../models/Review';
import { RoutesService } from '../../services/routes.service';
import { ReviewActionsService } from '../../services/review-actions.service';
import { ReviewsService } from '../../services/reviews.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-saved-reviews',
  imports: [],
  templateUrl: './user-saved-reviews.component.html',
  styles: ``
})
export class UserSavedReviewsComponent implements OnInit{
  reviews: Review[] = [];
  user: User = { userId: null, fullName: null, username: null };
  menuToggle: number | null = null;
  constructor(
    public routesService: RoutesService,
    public reviewActionsService: ReviewActionsService,
    private reviewsService: ReviewsService,
    private userService: UserService
  ) {}
  ngOnInit(): void {
    this.user = this.userService.getCurrentUserData();
    this.reviewsService.getSavedReviews(this.user.userId)?.subscribe({
      next: res => this.reviews = Array.isArray(res.reviews) ? res.reviews.filter((r: Review | undefined): r is Review => r !== undefined) : [],
      error: err => console.log(err)
    })
  }
}
