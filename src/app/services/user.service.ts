import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import User, { uuid } from '../../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = 'http://localhost:3000';
  private userData: any;

  constructor(private http: HttpClient) { }

  registerUser(userData: User) {
    return this.http.post<any>(`${this.apiUrl}/users/register`, userData);
  }

  loginUser(userData: User){
    return this.http.post<any>(`${this.apiUrl}/users/login`, userData);
  }

  getUser(){
    return this.http.get<User>(`${this.apiUrl}/users/getUser`);
  }

  getUserById(userId: string | null){
    if(!userId){
      throw new Error('No se encontro el ID del usuario');
    }
    return this.http.get<any>(`${this.apiUrl}/users/getUser/${userId}`, { params: { userId } });
  }

  getUserId(){
    return this.http.get<any>(`${this.apiUrl}/users/getId`);
  }

  updateUser(userData: User, userId: uuid | null){
    if(!userId) throw new Error('No se encontro el ID del usuario');
    return this.http.put<any>(`${this.apiUrl}/users/updateUser/${userId}`, userData, { params: { userId }});
  }

  setCurrentUserData(data: any){
    this.userData = data;
  }

  getCurrentUserData(){
    return this.userData;
  }
}