import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ReviewsService } from '../../services/reviews.service';
import { UserService } from '../../services/user.service';
import { Router, RouterLink } from '@angular/router';
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
  user: User = { message: undefined, userId: null, username: null, fullName: null};
  reviews: any[] = [];
  menuToggle: number | null = null;

  @ViewChild('menuContainer') menuContainer!: ElementRef;

  constructor(
    private userService: UserService, 
    private reviewsService: ReviewsService, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ){}
  ngOnInit(): void {
     this.userService.getUser().subscribe({
      next: res =>{
        this.message = res.message
        this.user.userId = res.userId;
        this.user.username = res.username;
        this.user.fullName = res.fullName;
        this.error = '';
        this.reviewsService.getUserReview(this.user.userId).subscribe({
          next: res =>{
            this.reviews = res.reviews;
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
      }
    });
  }

  toggleMenu(index: number){
    this.menuToggle = this.menuToggle === index ? null : index;
  }

  goDashboard(){
    this.router.navigate(['../dashboard/']);
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
