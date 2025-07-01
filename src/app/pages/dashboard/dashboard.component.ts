import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { ReviewsService } from '../../services/reviews.service';
import User from '../../../models/User';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class DashboardComponent implements OnInit {
  error: string = '';
  message: string | undefined = '';
  user: User = { message: undefined, userId: null, username: null, fullName: null};
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
      },
      error: err =>{
        this.error = err.error.message;
        this.message = '';
      }
    });
    this.reviewsService.getReview().subscribe({
      next: res =>{
        this.reviews = res.reviews;
      }
    });
  }

  toggleMenu(index: number){
    this.menuToggle = this.menuToggle === index ? null : index;
  }

  goProfile(){
    this.router.navigate(['../profile/', this.user.userId]);
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
