import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ReviewsService } from '../../services/reviews.service';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import User, { uuid } from '../../../models/User';

@Component({
  selector: 'app-profile',
  imports: [ RouterLink ],
  templateUrl: './profile.component.html',
  styles: ``
})
export class ProfileComponent implements OnInit{
  error: string = '';
  message: string | undefined = '';
  user: User = { message: undefined, userId: null, username: null, fullName: null, followers: 0, following: 0, biography: '' };
  reviews: any[] = [];
  menuToggle: number | null = null;
  revId: string | null = '';
  currentUser: any;

  @ViewChild('menuContainer') menuContainer!: ElementRef;

  constructor(
    private userService: UserService, 
    private reviewsService: ReviewsService, 
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ){}
  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUserData();
    this.revId = this.route.snapshot.paramMap.get('userId');
    this.userService.getUserById(this.revId!).subscribe({
      next: res =>{
        this.message = res.message
        this.user.userId = res.data.id;
        this.user.username = res.data.username;
        this.user.fullName = res.data.full_name;
        this.user.followers = res.data.followers;
        this.user.following = res.data.following;
        this.user.biography = res.data.biography;
        this.error = '';
        this.reviewsService.getUserReviews(this.user.userId, this.currentUser?.userId).subscribe({
          next: res =>{
            this.reviews = res.reviews;
          },
          error: err =>{
            this.error = err.error.message;
            this.message = '';
            this.reviews = [];
            console.log(err);
          }
        });
      },
      error: err =>{
        this.error = err.error.message;
        this.message = '';
        console.log(err);
      }
    });
  }

  toggleMenu(index: number){
    this.menuToggle = this.menuToggle === index ? null : index;
  }

  editReview(){
    if(this.menuToggle !== null){
      this.router.navigate(['../edit-review/', this.reviews[this.menuToggle].id]);
    }
  }

  goReview(reviewId: uuid){
    this.router.navigate(['../review/', reviewId]);
  }

  delReview(){
    if(this.menuToggle !== null){
      const reviewId = this.reviews[this.menuToggle].id;

      this.reviewsService.deleteReview(reviewId).subscribe({
        next: res => {
          if(this.menuToggle !== null){
            this.message = res.message;
            this.reviews.splice(this.menuToggle, 1);
            this.menuToggle = null;
          };
          this.reviewsService.getUserReviews(this.user.userId, this.currentUser.userId).subscribe({
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
