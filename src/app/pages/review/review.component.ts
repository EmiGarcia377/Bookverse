import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReviewsService } from '../../services/reviews.service';
import { UserService } from '../../services/user.service';
import { uuid } from '../../../models/User';

@Component({
  selector: 'app-review',
  imports: [ RouterLink ],
  templateUrl: './review.component.html',
  styles: ``
})
export class ReviewComponent implements OnInit {
  error: string = '';
  message: string = '';
  review: any = { id: '', content: '', score: 0, title: '', user_id: '', full_name: '', username: '', like_count: 0, liked_by_current_user: false };
  userId: uuid | null = null;
  reviewId: string | null = '';
  constructor(private reviewsService: ReviewsService, private route: ActivatedRoute, private userService: UserService) { }
  ngOnInit(): void {
    this.reviewId = this.route.snapshot.paramMap.get('reviewId');
    this.userService.getUserId().subscribe({
      next: res => {
        this.userId = res.id;
        if(this.reviewId){
          this.reviewsService.getReviewById(this.reviewId, this.userId).subscribe({
            next: res => {
              this.review = res.review;
            },
            error: err => {
              console.log(err);
            }
          });
        } else {
          this.error = "No se encontro la reseña con el id dado, vuelva a intentar con otra reseña"
        }
      },
      error: err => {
        console.log(err);
        if(this.reviewId){
          this.reviewsService.getReviewById(this.reviewId, this.userId).subscribe({
            next: res => {
              this.review = res.review;
            },
            error: err => {
              console.log(err);
            }
          });
        } else {
          this.error = "No se encontro la reseña con el id dado, vuelva a intentar con otra reseña"
        }
      }
    })
    
    
  }

  toggleLikeReview(liked: boolean){
    if(!liked){
      this.reviewsService.likeReview(this.userId, this.review.id).subscribe({
        next: res => {
          this.review.like_count = res.count;
          this.review.liked_by_current_user = true;
        }
      });
    } else {
      this.reviewsService.unlikeReview(this.userId, this.review.id).subscribe({
        next: res => {
          this.review.like_count = res.count;
          this.review.liked_by_current_user = false;
        }
      })
    }
  }
}
