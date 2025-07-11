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

  getReview(userId: any){
    return this.http.get<any>(`${this.apiUrl}/reviews/${userId}`, { params: { userId }});
  }

  getUserReviews(profileId: uuid | null, userId: any){
    if (!profileId) {
      throw new Error(`El usuario con el id ${profileId} no existe`);
    }
    return this.http.get<any>(`${this.apiUrl}/reviews/getUserReviews/${profileId}/${userId}`, { params: { profileId, userId }});
  }

  getReviewById(reviewId: string, userId: any){
    return this.http.get<any>(`${this.apiUrl}/reviews/getReviewById/${reviewId}/${userId}`, { params: { reviewId, userId } });
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

  likeReview(userId: uuid | null, reviewId: uuid){
    if(!userId) throw new Error('Necesitas iniciar sesion para poder realizar esta accion!');
    return this.http.post<any>(`${this.apiUrl}/reviews/like/${userId}`, { userId, reviewId });
  }

  unlikeReview(userId: uuid | null, reviewId: uuid){
    if(!userId) throw new Error('Necesitas iniciar sesion para poder realizar esta accion!');
    return this.http.delete<any>(`${this.apiUrl}/reviews/unlike/${reviewId}`, { body: { userId, reviewId }});
  }
}
