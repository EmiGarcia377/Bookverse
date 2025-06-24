import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { RouterLink } from '@angular/router';
import { ReviewsService } from '../../services/reviews.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class DashboardComponent implements OnInit {
  error: string = ''
  user = {
    fullName: '',
    username: ''
  };
  reviews: any[] = []
  constructor(private userService: UserService, private reviewsService: ReviewsService) { }

  ngOnInit(): void {
    this.userService.getUser().subscribe({
      next: res =>{
        this.user.username = res.username;
        this.user.fullName = res.fullName;
      },
      error: err =>{
        this.error = err.error.message;
      }
    });
    this.reviewsService.getReview().subscribe({
      next: res =>{
        this.reviews = res.reviews;
      }
    });
  }
}
