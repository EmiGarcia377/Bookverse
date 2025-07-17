import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { ReviewsService } from '../../services/reviews.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import User, { uuid } from '../../../models/User';
import { UserService } from '../../services/user.service';
import { RoutesService } from '../../services/routes.service';
import { ReviewActionsService } from '../../services/review-actions.service';

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
    private cdr: ChangeDetectorRef,
    public routesService: RoutesService,
    public reviewActionsService: ReviewActionsService
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
