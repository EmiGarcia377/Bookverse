import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ReviewsService } from '../../services/reviews.service';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import User from '../../../models/User';
import { RoutesService } from '../../services/routes.service';
import { ReviewActionsService } from '../../services/review-actions.service';
import Review from '../../../models/Review';

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
  reviews: Review[] = [];
  menuToggle: number | null = null;
  revId: string | null = '';
  currentUser: any;

  @ViewChild('menuContainer') menuContainer!: ElementRef;

  constructor(
    private userService: UserService, 
    private reviewsService: ReviewsService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    public routesService: RoutesService,
    public reviewActionsService: ReviewActionsService
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
        this.user.profilePic = res.data.profilepic_url;
        this.error = '';
        this.reviewsService.getUserReviews(this.user.userId, this.currentUser?.userId).subscribe({
          next: res => {
            this.reviews = Array.isArray(res.reviews) ? res.reviews.filter((r: Review | undefined): r is Review => r !== undefined) : [];
            this.error = '';
            this.message = '';
          },
          error: err => {
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
    this.menuToggle = this.reviewActionsService.toggleMenu(index, this.menuToggle);
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
