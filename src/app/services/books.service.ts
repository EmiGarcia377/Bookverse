import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { uuid } from '../../models/User';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  private readonly apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  addBookTodb(userId: uuid, book: any, library: string){
    return this.http.post<any>(`${this.apiUrl}/books/addBook/${userId}`, { book, library });
  }

  createCustomBook(userId: uuid, book: any, file?: File){
    const formData = new FormData();
    formData.append('book-covers', file ? file : '');
    formData.append('book', JSON.stringify(book));
    return this.http.post<any>(`${this.apiUrl}/books/createCustomBook/${userId}`, formData);
  }

  createLibrary(userId: uuid, library: any){
    return this.http.post<any>(`${this.apiUrl}/books/createLib/${userId}`, library);
  }

  getUserBooks(userId: uuid){
    return this.http.get<any>(`${this.apiUrl}/books/getBooks/${userId}`);
  }

  getUserLibraries(userId: uuid){
    return this.http.get<any>(`${this.apiUrl}/books/getUserLib/${userId}`);
  }

  getStatusSection(userId: uuid){
    return this.http.get<any>(`${this.apiUrl}/books/getStatusSection/${userId}`);
  }

  getCustomLibraries(userId: uuid){
    return this.http.get<any>(`${this.apiUrl}/books/getCustomLib/${userId}`);
  }

  updateStatus(bookName: string, newStatus: string){
    return this.http.patch<any>(`${this.apiUrl}/books/updateStatus/${bookName}`, { newStatus });
  }

  updateActualPage(bookId: string, actualPage: number){
    return this.http.patch<any>(`${this.apiUrl}/books/updateActualPage/${bookId}`, { actualPage });
  }
}
