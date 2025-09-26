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
  createQuote(userId: uuid, bookId: uuid, content: string, quotePage: number){
    return this.http.post<any>(`${this.apiUrl}/quotes/createQuote/${userId}/${bookId}`, { content, quotePage });
  }

  //G E T
  getBookQuotes(bookId: uuid){
    return this.http.get<any>(`${this.apiUrl}/quotes/getQuotes/${bookId}`);
  }

  getQuotesSection(userId: uuid){
    return this.http.get<any>(`${this.apiUrl}/quotes/getQuotesSection/${userId}`);
  }

  getAllQuotes(userId: uuid){
    return this.http.get<any>(`${this.apiUrl}/quotes/getAllQuotes/${userId}`);
  }

  //P A T C H
  updateQuote(quoteId: uuid, userId: uuid, content: string, quotePage: number){
    return this.http.patch<any>(`${this.apiUrl}/quotes/updateQuote/${userId}/${quoteId}`, { content, quotePage });
  }

  //D E L E T E
  deleteQuote(userId: uuid, quoteId: uuid){
    return this.http.delete<any>(`${this.apiUrl}/quotes/deleteQuote/${userId}/${quoteId}`);
  }
}
