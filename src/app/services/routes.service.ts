import { Injectable } from '@angular/core';
import { uuid } from '../../models/User';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoutesService {

  constructor(private router: Router) { }

  goProfile(userId: uuid | null){
    this.router.navigate(['../profile/', userId]);
  }

  goUserDash(userId: uuid | null){
    if(!userId) throw new Error("Inicia sesion para poder acceder a tu dashboard!")
    this.router.navigate(['../user-dashboard/', userId]);
  }

  goReview(reviewId: uuid | null){
    this.router.navigate(['../review/', reviewId]);
  }

  goSavedReviews(userId: uuid | null){
    this.router.navigate(['../saved-reviews/', userId])
  }

  goDashboard(){
    this.router.navigate(['../dashboard/']);
  }
}
