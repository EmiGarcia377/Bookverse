import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { ReviewsService } from '../../services/reviews.service';
import User, { uuid } from '../../../models/User';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class DashboardComponent implements OnInit {
  error: string = '';
  message: string | undefined = '';
  user: User = { message: undefined, userId: null, username: null, fullName: null };
  reviews: any[] = []
  menuToggle: number | null = null;
  constructor(
    private userService: UserService,
    private reviewsService: ReviewsService, 
    private router: Router, 
    private cdr: ChangeDetectorRef
  ){}

  @ViewChild('menuContainer') menuContainer!: ElementRef;

  ngOnInit(): void {
    this.userService.getUser().subscribe({
      next: res =>{
        this.message = res.message
        this.user.userId = res.userId;
        this.user.username = res.username;
        this.user.fullName = res.fullName;
        this.error = '';
        this.userService.setCurrentUserData(this.user);
        this.reviewsService.getReview(this.user.userId).subscribe({
          next: res =>{
            this.reviews = res.reviews;
          },
          error: err => console.log(err)
        });
      },
      error: err =>{
        this.error = err.error.message;
        this.message = '';
        console.log(err);
        this.reviewsService.getReview(this.user.userId).subscribe({
          next: res =>{
            this.reviews = res.reviews;
          },
          error: err => console.log(err)
        });
      }
    });
  }

  toggleMenu(index: number){
    this.menuToggle = this.menuToggle === index ? null : index;
  }

  goProfile(userId: uuid){
    this.router.navigate(['../profile/', userId]);
  }

  goUserDash(){
    this.router.navigate(['../user-dashboard/', this.user.userId]);
  }

  goReview(reviewId: uuid){
    this.router.navigate(['../review/', reviewId]);
  }

  editReview(){
    if(this.menuToggle !== null){
      this.router.navigate(['../edit-review/', this.reviews[this.menuToggle].id]);
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
