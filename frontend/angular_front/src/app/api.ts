import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MediaItem, Book, Movie, Music, SearchOptions } from './media';

@Injectable({
  providedIn: 'root'
})
export class Api {
    private readonly apiUrl = 'http://localhost:3000';

    constructor (private http: HttpClient) { }

    loadDemoDataIntoGolem(): Observable<string> {
        return this.http.get<string>(`${this.apiUrl}/load-data`);
    }

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
    
    getSearchOptions(): Observable<SearchOptions> {
        return this.http.get<SearchOptions>(`${this.apiUrl}/search-options`);
    }

    executeQuery(query: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/query?${query}`);
    }

    save(item: MediaItem): Observable<any> {
        // This will POST the complete object to a /media endpoint
        return this.http.post<any>(`${this.apiUrl}/save-new`, item);
    }
}
