import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { uuid } from '../../models/User';
import Review from '../../models/Review';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  private readonly apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  createReview(reviewForm: any){
    return this.http.post<any>(`${this.apiUrl}/reviews/create`, reviewForm);
  }

  getReview(userId: string | null){
    if(!userId) userId = 'null'
    return this.http.get<Review>(`${this.apiUrl}/reviews/${userId}`, { params: { userId }});
  }

  getUserReviews(profileId: uuid | null, userId: string | null){
    if (!profileId) {
      throw new Error(`El usuario con el id ${profileId} no existe`);
    }
    if(!userId) userId = 'null';
    return this.http.get<any>(`${this.apiUrl}/reviews/getUserReviews/${profileId}/${userId}`, { params: { profileId, userId }});
  }

  getReviewById(reviewId: string, userId: string | null){
    if(!userId) userId = 'null';
    return this.http.get<Review>(`${this.apiUrl}/reviews/getReviewById/${reviewId}/${userId}`, { params: { reviewId, userId } });
  }

  getSavedReviews(userId: string | null){
    if(!userId) return
    return this.http.get<any>(`${this.apiUrl}/reviews/getSavedReviews/${userId}`, { params: { userId }});
  }

  editReview(reviewId: uuid | null, reviewData: any){
    if(!reviewId) throw new Error('No se encontro la reseña');
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

  saveReview(userId: uuid | null, reviewId: uuid){
    if(!userId) throw new Error('Necesitas iniciar sesion para poder realizar esta accion!');
    return this.http.post<any>(`${this.apiUrl}/reviews/save`, { userId, reviewId });
  }

  unsaveReview(userId: uuid | null, reviewId: uuid){
    if(!userId) throw new Error('Necesitas iniciar sesion para poder realizar esta accion!');
    return this.http.delete<any>(`${this.apiUrl}/reviews/unsave`, { body: { userId, reviewId }});
  }

  createComment(userId: uuid | null, reviewId: uuid | null, comment: string){
    if(!userId || !reviewId) throw new Error('Necesitas iniciar sesion para poder realizar esta accion!');
    return this.http.post<any>(`${this.apiUrl}/reviews/comment`, { userId, reviewId, comment });
  }

  editComment(userId: uuid | null, commentId: uuid, comment: string){
    if(!userId) throw new Error('Necesitas iniciar sesion para poder realizar esta accion!');
    return this.http.patch<any>(`${this.apiUrl}/reviews/editComment`, { userId, commentId, comment });
  }

  delComment(commentId: uuid, userId: uuid | null, reviewId: string | null){
    if(!userId) throw new Error('Necesitas iniciar sesion para poder realizar esta accion!');
    return this.http.delete<any>(`${this.apiUrl}/reviews/delComment`, { body: { userId, commentId, reviewId }});
  }

  getCommentsByReview(reviewId: string | null){
    if(!reviewId) throw new Error('Por favor ingresa una reseña valida');
    return this.http.get<any>(`${this.apiUrl}/reviews/comment/${reviewId}`, { params: { reviewId }});
  }

  getUserDashboard(userId: uuid | null){
    if(!userId) throw new Error("Necesitas iniciar sesion para poder realizar esta accion!");
    return this.http.get<any>(`${this.apiUrl}/reviews/getUserDashboard/${userId}`, { params: { userId }});
  }
}
