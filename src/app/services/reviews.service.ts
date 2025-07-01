import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { uuid } from '../../models/User';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  private readonly apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  createReview(reviewForm: any){
    return this.http.post<any>(`${this.apiUrl}/create-review`, reviewForm);
  }

  getReview(){
    return this.http.get<any>(`${this.apiUrl}/getReview`);
  }

  getUserReview(userId: uuid | null){
    if (!userId) {
      throw new Error('User ID is required to fetch user reviews');
    }
    return this.http.get<any>(`${this.apiUrl}/getUserReview/${userId}`, { params: { userId }});
  }
}
