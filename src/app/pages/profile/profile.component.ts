import { Component, OnInit } from '@angular/core';
import { ReviewsService } from '../../services/reviews.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styles: ``
})
export class ProfileComponent implements OnInit{
  error: string = '';
  message: string = '';
  user = {
    id: '',
    fullName: '',
    username: ''
  };
  reviews: any[] = []
  constructor(private userService: UserService, private reviewsService: ReviewsService, private router: Router) { }
  ngOnInit(): void {
     this.userService.getUser().subscribe({
      next: res =>{
        this.message = res.message
        this.user.id = res.userId;
        this.user.username = res.username;
        this.user.fullName = res.fullName;
        this.error = '';
        this.reviewsService.getUserReview(this.user.id).subscribe({
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
  goDashboard(){
    this.router.navigate(['../dashboard/']);
  }
}
