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
  review: any = { id: '', content: '', score: 0, title: '', users: { id: '', full_name: '', username: '' }};
  userId: uuid | null = null;
  likes: number = 0;
  reviewId: string | null = '';
  constructor(private reviewsService: ReviewsService, private route: ActivatedRoute, private userService: UserService) { }
  ngOnInit(): void {
    this.userService.getUserId().subscribe({
      next: res => {
        this.userId = res.id;
      },
      error: err => {
        console.log(err);
      }
    })
    this.reviewId = this.route.snapshot.paramMap.get('reviewId');
    if(this.reviewId){
      this.reviewsService.getReviewById(this.reviewId).subscribe({
        next: res => {
          this.review = res.review;
          console.log(res)
          this.reviewsService.getLikes(this.review.id).subscribe({
            next: res => {
              this.likes = res.data;
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
    } else {
      this.error = "No se encontro la reseña con el id dado, vuelva a intentar con otra reseña"
    }
  }

  likeReview(){
    this.reviewsService.likeReview(this.userId, this.review.id).subscribe({
      next: res => {
        this.reviewsService.getLikes(this.review.id).subscribe({
            next: res => {
              this.likes = res.data;
            },
            error: err => {
              console.log(err);
            }
          });
      }
    });
  }
}
