import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/register';

  constructor(private http: HttpClient) { }

  registerUser(userData: any) {
    return this.http.post(this.apiUrl, userData);
  }
}
