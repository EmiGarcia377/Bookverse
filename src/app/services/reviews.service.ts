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
    return this.http.post<any>(`${this.apiUrl}/reviews/create`, reviewForm);
  }

  getReview(){
    return this.http.get<any>(`${this.apiUrl}/reviews/`);
  }

  getUserReview(userId: uuid | null){
    if (!userId) {
      throw new Error('User ID is required to fetch user reviews');
    }
    return this.http.get<any>(`${this.apiUrl}/reviews/getUserReview/${userId}`, { params: { userId }});
  }

  getReviewById(reviewId: string){
    return this.http.get<any>(`${this.apiUrl}/reviews/getReviewById/${reviewId}`, { params: { reviewId }});
  }

  editReview(reviewId: uuid, reviewData: any){
    return this.http.put<any>(`${this.apiUrl}/reviews/edit/${reviewId}`, reviewData, { params: { reviewId }});
  }

  deleteReview(reviewId: uuid){
    if(!reviewId){
      throw new Error('Review ID is required to delete a review');
    }
    return this.http.delete<any>(`${this.apiUrl}/reviews/delete/${reviewId}`, { params: { reviewId }});
  }
}
