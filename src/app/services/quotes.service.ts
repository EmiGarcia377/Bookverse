import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { uuid } from '../../models/User';

@Injectable({
  providedIn: 'root'
})
export class QuotesService {
  private readonly apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  //P O S T
  createQuote(userId: uuid, bookId: uuid, content: string){
    return this.http.post<any>(`${this.apiUrl}/quotes/createQuote/${userId}/${bookId}`, { content });
  }

  //G E T
  getBookQuotes(bookId: uuid){
    return this.http.get<any>(`${this.apiUrl}/quotes/getQuotes/${bookId}`);
  }

  getQuotesSection(userId: uuid){
    return this.http.get<any>(`${this.apiUrl}/quotes/getQuotesSection/${userId}`);
  }
}
