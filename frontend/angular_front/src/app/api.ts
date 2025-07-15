import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MediaItem, Book, Movie, Music } from './media';

@Injectable({
  providedIn: 'root'
})
export class Api {
    private readonly apiUrl = 'http://localhost:3000';

    constructor (private http: HttpClient) { }

    getByKey(key: string): Observable<MediaItem> {
        return this.http.get<MediaItem>(`${this.apiUrl}/key/${key}`);
    }

    getAll(): Observable<MediaItem[]> {
        return this.http.get<MediaItem[]>(`${this.apiUrl}/query`);
    }

    getBooks(): Observable<MediaItem[]> {
        return this.http.get<Book[]>(`${this.apiUrl}/query?type=books`);
    }

    getMusic(): Observable<MediaItem[]> {
        return this.http.get<Music[]>(`${this.apiUrl}/query?type=music`);
    }
    
    getMovies(): Observable<MediaItem[]> {
        return this.http.get<Movie[]>(`${this.apiUrl}/query?type=movies`);
    }
    
    /**
     * POST request to create a new book.
     * @param postData The data for the new book.
     * @returns An Observable of the created Book.
     */
    createBook(postData: Book): Observable<Book> {
        return this.http.post<Book>(`${this.apiUrl}/posts`, postData);
    }
}
