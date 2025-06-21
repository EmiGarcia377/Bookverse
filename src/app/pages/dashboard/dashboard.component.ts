import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { RouterLink } from '@angular/router';

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
  constructor(private userService: UserService) { }

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

  }
}
