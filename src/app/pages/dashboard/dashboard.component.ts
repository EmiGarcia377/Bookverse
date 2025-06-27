import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { ReviewsService } from '../../services/reviews.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class DashboardComponent implements OnInit {
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

  goProfile(){
    console.log(this.user.id)
    this.router.navigate(['../profile/', this.user.id]);
  }
}
