import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleBooksService {

  constructor(private http: HttpClient) {}

  searchBooks(query: string, startIndex: number = 0): Observable<any[]> {
    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&startIndex=${startIndex}&maxResults=10`;
    return this.http.get<{ items: any[] }>(apiUrl).pipe(
      map(response => response.items || []),
      catchError(() => of([])) 
    );
  }
}
