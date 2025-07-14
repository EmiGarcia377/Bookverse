import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { ReviewsService } from '../../services/reviews.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import User, { uuid } from '../../../models/User';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-saved-reviews',
  imports: [RouterLink],
  templateUrl: './saved-reviews.component.html',
  styles: ``
})
export class SavedReviewsComponent implements OnInit{
  userId: string | null = '';
  user: User = { message: undefined, userId: null, username: null, fullName: null };
  reviews: any[] = [];
  menuToggle: number | null = null;

  constructor(
    private reviewsService: ReviewsService, 
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId');
    this.userService.getUser().subscribe({
      next: res =>{
        this.user.userId = res.userId;
        this.user.username = res.username;
        this.user.fullName = res.fullName;
        this.userService.setCurrentUserData(this.user);
        this.reviewsService.getSavedReviews(this.userId)?.subscribe({
          next: res => {
            this.reviews = res.reviews;
            console.log(res)
          },
          error: err => {
            console.log(err);
          }
        });
      },
      error: err =>{
        console.log(err);
      }
    });
  }

  goReview(reviewId: uuid){
    this.router.navigate(['../review/', reviewId]);
  }

  goProfile(userId: uuid){
    this.router.navigate(['../profile/', userId]);
  }

  toggleMenu(index: number){
    this.menuToggle = this.menuToggle === index ? null : index;
  }

  editReview(){
    if(this.menuToggle !== null){
      this.router.navigate(['../edit-review/', this.reviews[this.menuToggle].id]);
    }
  }

  delReview(){
    if(this.menuToggle !== null){
      const reviewId = this.reviews[this.menuToggle].id;

      this.reviewsService.deleteReview(reviewId).subscribe({
        next: res => {
          if(this.menuToggle !== null){
            this.reviews.splice(this.menuToggle, 1);
            this.menuToggle = null;
          };
          this.reviewsService.getReview(this.user.userId).subscribe({
              next: res => {
                this.reviews = res.reviews;
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

  toggleLikeReview(liked: boolean, userId: uuid | null, reviewId: uuid){
    if(!liked){
      this.reviewsService.likeReview(userId, reviewId).subscribe({
        next: res => {
          const reviewIndex = this.reviews.findIndex((review) => review.id === reviewId);
          this.reviews[reviewIndex].like_count = res.count;
          this.reviews[reviewIndex].liked_by_current_user = true;
        }
      });
    } else {
      this.reviewsService.unlikeReview(userId, reviewId).subscribe({
        next: res => {
          const reviewIndex = this.reviews.findIndex((review) => review.id === reviewId);
          this.reviews[reviewIndex].like_count = res.count;
          this.reviews[reviewIndex].liked_by_current_user = false;
        }
      })
    }
  }

  toggleSaveReview(saved: boolean, userId: uuid | null, reviewId: uuid){
    if(!saved){
      this.reviewsService.saveReview(userId, reviewId).subscribe({
        next: res => {
          const reviewIndex = this.reviews.findIndex((review) => review.id === reviewId);
          this.reviews[reviewIndex].saved_count = res.count;
          this.reviews[reviewIndex].saved_by_current_user = true;
        },
        error: err => {
          console.log(err);
        }
      });
    } else {
      this.reviewsService.unsaveReview(userId, reviewId).subscribe({
        next: res => {
          const reviewIndex = this.reviews.findIndex((review) => review.id === reviewId);
          this.reviews[reviewIndex].saved_count = res.count;
          this.reviews[reviewIndex].saved_by_current_user = false;
        },
        error: err => {
          console.log(err);
        }
      });
    }
  }

  @HostListener('document:click', ['$event'])
  cerrarMenus(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const seHizoClickEnBoton = target.closest('button');

    if (!seHizoClickEnBoton) {
      this.menuToggle = null;
      this.cdr.detectChanges();
    }
  }
}
