import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ReviewsService } from '../../services/reviews.service';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import User from '../../../models/User';

@Component({
  selector: 'app-profile',
  imports: [ RouterLink ],
  templateUrl: './profile.component.html',
  styles: ``
})
export class ProfileComponent implements OnInit{
  error: string = '';
  message: string | undefined = '';
  user: User = { message: undefined, userId: null, username: null, fullName: null, followers: 0, following: 0 };
  reviews: any[] = [];
  menuToggle: number | null = null;
  revId: string | null = '';
  sessionId: string | null = ''

  @ViewChild('menuContainer') menuContainer!: ElementRef;

  constructor(
    private userService: UserService, 
    private reviewsService: ReviewsService, 
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ){}
  ngOnInit(): void {
    this.revId = this.route.snapshot.paramMap.get('userId');
    this.userService.getUserById(this.revId!).subscribe({
      next: res =>{
        this.message = res.message
        this.user.userId = res.data.id;
        this.user.username = res.data.username;
        this.user.fullName = res.data.full_name;
        this.user.followers = res.data.followers;
        this.user.following = res.data.following;
        this.error = '';
        this.reviewsService.getUserReview(this.user.userId).subscribe({
          next: res =>{
            this.reviews = res.reviews;
            this.sessionId = sessionStorage.getItem('user_id') ? sessionStorage.getItem('user_id') : localStorage.getItem('user_id');
          },
          error: err =>{
            this.error = err.error.message;
            this.message = '';
            this.reviews = [];
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
          this.reviewsService.getUserReview(this.user.userId).subscribe({
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
