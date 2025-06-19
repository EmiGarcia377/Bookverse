import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import User from '../../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  registerUser(userData: User) {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }
  loginUser(userData: User){
    return this.http.post<any>(`${this.apiUrl}/login`, userData);
  }
}
