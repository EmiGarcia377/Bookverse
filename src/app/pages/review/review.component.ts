import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReviewsService } from '../../services/reviews.service';
import { UserService } from '../../services/user.service';
import { uuid } from '../../../models/User';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-review',
  imports: [ RouterLink, ReactiveFormsModule, FormsModule ],
  templateUrl: './review.component.html',
  styles: ``
})
export class ReviewComponent implements OnInit {
  error: string = '';
  message: string = '';
  review: any = { id: '', content: '', score: 0, title: '', user_id: '', full_name: '', username: '', like_count: 0, liked_by_current_user: false };
  comments: any[] = [];
  userId: uuid | null = null;
  reviewId: string | null = '';
  commentInput: FormControl;
  menuToggle: number | null = null;
  editCommentIndex: number | null = null;
  editedCommentContent: string = '';

  constructor(private reviewsService: ReviewsService, private route: ActivatedRoute, private userService: UserService) { 
    this.commentInput = new FormControl('', [Validators.required, Validators.min(10)]);
  }

  ngOnInit(): void {
    this.reviewId = this.route.snapshot.paramMap.get('reviewId');
    this.userService.getUserId().subscribe({
      next: res => {
        this.userId = res.id;
        if(this.reviewId){
          this.reviewsService.getReviewById(this.reviewId, this.userId).subscribe({
            next: res => {
              this.review = res.review;
              console.log(res)
              this.reviewsService.getCommentsByReview(this.reviewId).subscribe({
                next: res => {
                  this.comments = res.comments;
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
      },
      error: err => {
        console.log(err);
        if(this.reviewId){
          this.reviewsService.getReviewById(this.reviewId, this.userId).subscribe({
            next: res => {
              this.review = res.review;
              this.reviewsService.getCommentsByReview(this.reviewId).subscribe({
                next: res => {
                  this.comments = res.comments;
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
    });
  }

  toggleMenu(index: number){
    this.menuToggle = this.menuToggle === index ? null : index;
  }

  editComment(index: number, content: string){
    this.editCommentIndex = index;
    this.editedCommentContent = content;
  }

  confirmEditComment(commentId: uuid){
    this.reviewsService.editComment(this.userId, commentId, this.editedCommentContent).subscribe({
      next: res => {
        this.editCommentIndex = null;
        this.editedCommentContent = "";
        this.reviewsService.getCommentsByReview(this.reviewId).subscribe({
          next: res => {
            this.comments = res.comments;
          },
          error: err => {
            console.log(err);
          }
        });
      }
    });
  }

  cancelEditComment(){
    this.editCommentIndex = null;
    this.editedCommentContent = "";
  }

  delComment(commentId: uuid){
    this.editCommentIndex = null;
    this.editedCommentContent = "";
    this.reviewsService.delComment(commentId, this.userId, this.reviewId).subscribe({
      next: res => {
        this.review.comments_count = res.count;
        this.reviewsService.getCommentsByReview(this.reviewId).subscribe({
          next: res => {
            this.comments = res.comments;
          },
          error: err => {
            console.log(err);
          }
        });
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

  toggleSaveReview(saved: boolean){
    if(!saved){
      this.reviewsService.saveReview(this.userId, this.review.id).subscribe({
        next: res => {
          this.review.saved_count = res.count;
          this.review.saved_by_current_user = true;
        },
        error: err => {
          console.log(err);
        }
      });
    } else {
      this.reviewsService.unsaveReview(this.userId, this.review.id).subscribe({
        next: res => {
          this.review.saved_count = res.count;
          this.review.saved_by_current_user = false;
        },
        error: err => {
          console.log(err);
        }
      });
    }
  }

  submitComment(){
    this.reviewsService.createComment(this.userId, this.review.id, this.commentInput.value).subscribe({
      next: res => {
        this.review.comments_count = res.count
        this.commentInput.reset();
        this.reviewsService.getCommentsByReview(this.reviewId).subscribe({
          next: res => {
            this.comments = res.comments;
          },
          error: err => {
            console.log(err);
          }
        });
      },
      error: err => {
        console.log(err);
      }
    })
  }

  @ViewChild('autoTextarea') textarea!: ElementRef<HTMLTextAreaElement>;
  ajustarAltura(){
    const el = this.textarea.nativeElement;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }
}
