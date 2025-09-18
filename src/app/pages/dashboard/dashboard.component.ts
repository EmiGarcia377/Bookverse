import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { RouterLink } from '@angular/router';
import { ReviewsService } from '../../services/reviews.service';
import User from '../../../models/User';
import { RoutesService } from '../../services/routes.service';
import { ReviewActionsService } from '../../services/review-actions.service';
import Review from '../../../models/Review';

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
  reviews: Review[] = []
  menuToggle: number | null = null;
  constructor(
    private userService: UserService,
    private reviewsService: ReviewsService, 
    private cdr: ChangeDetectorRef,
    public routesService: RoutesService,
    public reviewActionsService: ReviewActionsService
  ){}

  @ViewChild('menuContainer') menuContainer!: ElementRef;

  ngOnInit(): void {
    this.userService.getUser().subscribe({
      next: res =>{
        this.message = res.message
        this.user.userId = res.userId;
        this.user.username = res.username;
        this.user.fullName = res.fullName;
        this.user.profilePic = res.profilePic;
        this.error = '';
        this.userService.setCurrentUserData(this.user);
        this.reviewsService.getReview(this.user.userId).subscribe({
          next: res =>{
            this.reviews = Array.isArray(res.reviews) ? res.reviews.filter((r: Review | undefined): r is Review => r !== undefined) : [];
          },
          error: err => console.log(err)
        });
      },
      error: err =>{
        this.error = err.error.message;
        this.message = '';
        console.log(err);
        this.reviewsService.getReview(this.user.userId).subscribe({
          next: res => {
            this.reviews = Array.isArray(res.reviews) ? res.reviews.filter((r: Review | undefined): r is Review => r !== undefined) : [];
          },
          error: err => console.log(err)
        });
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
