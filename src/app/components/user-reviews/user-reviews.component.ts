import { Component, OnInit } from '@angular/core';
import { ReviewsService } from '../../services/reviews.service';
import Review from '../../../models/Review';
import { UserService } from '../../services/user.service';
import User from '../../../models/User';
import { RoutesService } from '../../services/routes.service';
import { ReviewActionsService } from '../../services/review-actions.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-reviews',
  imports: [RouterLink],
  templateUrl: './user-reviews.component.html',
  styles: ``
})
export class UserReviewsComponent implements OnInit{
  reviews: Review[] = [];
  user: User = { userId: null, fullName: null, username: null };
  menuToggle: number | null = null;
  constructor(
    private reviewsService: ReviewsService, 
    private userService: UserService,
    public routesService: RoutesService,
    public reviewActionsService: ReviewActionsService
  ) {
    
  }
  ngOnInit(): void {
    this.user = this.userService.getCurrentUserData();
    this.reviewsService.getUserReviews(this.user.userId, this.user.userId).subscribe({
      next: res => {
        console.log(res)
        this.reviews = Array.isArray(res.reviews) ? res.reviews.filter((r: Review | undefined): r is Review => r !== undefined) : [];
      },
      error: err => console.log(err)
    })
  }

  toggleMenu(index: number){
    this.menuToggle = this.reviewActionsService.toggleMenu(index, this.menuToggle);
  }
}
