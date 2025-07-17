import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ReviewsService } from './reviews.service';
import User, { uuid } from '../../models/User';

@Injectable({
  providedIn: 'root'
})
export class ReviewActionsService {

  constructor(private router: Router, private reviewsService: ReviewsService) { }

  toggleMenu(index: number, menuToggle: number | null){
    menuToggle = menuToggle === index ? null : index;
  }

  editReview(menuToggle: number | null, reviews: any[]){
    if(menuToggle !== null){
      this.router.navigate(['../edit-review/', reviews[menuToggle].id]);
    }
  }

  delReview(menuToggle: number | null, reviews: any[], user: User){
    if(menuToggle !== null){
      const reviewId = reviews[menuToggle].id;

      this.reviewsService.deleteReview(reviewId).subscribe({
        next: res => {
          if(menuToggle !== null){
            reviews.splice(menuToggle, 1);
            menuToggle = null;
          };
          this.reviewsService.getReview(user.userId).subscribe({
              next: res => {
                reviews = res.reviews;
              },
              error: err => {
                console.log(err);
              }
          });
        },
        error: err => {
          console.log(err);
        }
      });
    }
  }

  toggleLikeReview(liked: boolean, userId: uuid | null, reviewId: uuid, reviews: any[]){
      if(!liked){
        this.reviewsService.likeReview(userId, reviewId).subscribe({
          next: res => {
            const reviewIndex = reviews.findIndex((review) => review.id === reviewId);
            reviews[reviewIndex].like_count = res.count;
            reviews[reviewIndex].liked_by_current_user = true;
          }
        });
      } else {
        this.reviewsService.unlikeReview(userId, reviewId).subscribe({
          next: res => {
            const reviewIndex = reviews.findIndex((review) => review.id === reviewId);
            reviews[reviewIndex].like_count = res.count;
            reviews[reviewIndex].liked_by_current_user = false;
          }
        })
      }
    }
  
    toggleSaveReview(saved: boolean, userId: uuid | null, reviewId: uuid, reviews: any[]){
      if(!saved){
        this.reviewsService.saveReview(userId, reviewId).subscribe({
          next: res => {
            const reviewIndex = reviews.findIndex((review) => review.id === reviewId);
            reviews[reviewIndex].saved_count = res.count;
            reviews[reviewIndex].saved_by_current_user = true;
          },
          error: err => {
            console.log(err);
          }
        });
      } else {
        this.reviewsService.unsaveReview(userId, reviewId).subscribe({
          next: res => {
            const reviewIndex = reviews.findIndex((review) => review.id === reviewId);
            reviews[reviewIndex].saved_count = res.count;
            reviews[reviewIndex].saved_by_current_user = false;
          },
          error: err => {
            console.log(err);
          }
        });
      }
    }

    toggleLikeReviewSingle(liked: boolean, review: any, userId: uuid | null){
    if(!liked){
      this.reviewsService.likeReview(userId, review.id).subscribe({
        next: res => {
          review.like_count = res.count;
          review.liked_by_current_user = true;
        }
      });
    } else {
      this.reviewsService.unlikeReview(userId, review.id).subscribe({
        next: res => {
          review.like_count = res.count;
          review.liked_by_current_user = false;
        }
      })
    }
  }

  toggleSaveReviewSingle(saved: boolean, review: any, userId: uuid | null){
    if(!saved){
      this.reviewsService.saveReview(userId, review.id).subscribe({
        next: res => {
          review.saved_count = res.count;
          review.saved_by_current_user = true;
        },
        error: err => {
          console.log(err);
        }
      });
    } else {
      this.reviewsService.unsaveReview(userId, review.id).subscribe({
        next: res => {
          review.saved_count = res.count;
          review.saved_by_current_user = false;
        },
        error: err => {
          console.log(err);
        }
      });
    }
  }
}
